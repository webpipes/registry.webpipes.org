helpers = require '../libs/helpers'
db      = require '../libs/database'
db      = db.db
_       = require 'underscore'

class exports.BlocksModel

  create: (definition, callback) ->
    key = helpers.getSlug definition.name
    definition.type = 'webpipe'
    db.save key, definition, (err, res) ->
      callback err, res

  readAll: (callback) -> 
    db.view 'webpipes/all', (err, result) ->
      data = _.map _.pluck(result, 'value'), (definition) ->
        _.omit definition, ['_rev', '_id', 'type']
      callback err, data

  readByName: (name, callback) ->
    db.get name, (err, definition) ->
      callback err, _.omit definition, ['_rev', '_id', 'type']