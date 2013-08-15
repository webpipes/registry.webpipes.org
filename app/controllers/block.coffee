blocks  = new (require '../models/blocks').BlocksModel
helpers = require '../libs/helpers'
_       = require 'underscore'

exports.setup = (app) ->
  controller = new exports.BlockController
  app.get '/blocks.:format?', controller.index
  app.get '/blocks/:name.:format?', controller.view
  app.post '/blocks', controller.register

class exports.BlockController

  index: (request, response) ->
    format = request.param 'format'

    blocks.readAll (err, definitions) -> 
      if err
        response.send 500, err
      else if format is 'json'
        response.json definitions
      else
        slugs = {}
        _.each definitions, (definition) ->
          slugs[helpers.getSlug(definition.name)] = definition;
        
        response.render 'blocks/read_all',
          definitions: slugs,
          title: "Block Definitions"
        
  view: (request, response) ->
    name = request.param 'name'
    format = request.param 'format'

    if not name
      response.send 500, 'Missing "name" argument.'
    else
      blocks.readByName name, (err, definition) ->
        if err
          response.send 404, "Can't find that webpipe!"
        else if format is 'json'
          response.json definition
        else
          response.render 'blocks/read_by_name',
            definition: definition,
            title: definition.name + " Block",
            slug: helpers.getSlug(definition.name)
  
  register: (request, response) ->
    url = request.param 'url'
    
    if not url
      response.send 404, "Webpipe doesn't have a name?!"
    else
      helpers.getBlockDefinition url, (err, definition) ->
        if err
          response.send 500, err
        else
          blocks.create definition, (err, res) ->
            if err
              response.send 404, "Failed to register."
            else
              response.send 200

