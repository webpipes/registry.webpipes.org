var blocks = {};
var functions = require('../libs/functions.js').functions;
var models = require('../models/index.js').models;
var _ = require('underscore');

blocks.readAll = function (request, response) {
  models.block.readAll(function (err, definitions) {
    if (err) {
      console.log(err);
      response.send(500, err);
      return;
    }

    if (request.param("format") === 'json') {
      response.json(definitions);
    } else {
      var slugs = {};
      _.each(definitions, function (definition) {
        slugs[functions.getSlug(definition.name)] = definition;
      });
      response.render('blocks/read_all', {
        definitions: slugs,
        title: "Block Definitions"
      });
    }
  });
};

blocks.readByName = function (request, response) {
  var err = null;
  var name = request.param("name");

  if (!name) {
    response.send(404, 'Missing "name" argument.');
    return;
  }

  models.block.readByName(name, function (err, definition) {
    if (err) {
      response.send(404, "Can't find that webpipe!");
      return;
    }

    if (request.param("format") === 'json') {
      response.json(definition);
    } else {
      response.render('blocks/read_by_name.html', {
        definition: definition,
        title: definition.name + " Block",
        slug: functions.getSlug(definition.name)
      });
    }
  });
};

blocks.register = function (request, response) {
  var url = request.param("url");
  if (!url) {
    response.send(404, "Webpipe doesn't have a name?!");
    return;
  }

  // Look up currently stored webpipe with that slug name
  functions.getBlockDefinition(url, function (err, definition) {
    if (err) {
      response.send(500, err);
      return;
    }
    models.block.create(definition, function (err, res) {
      if (err) {
        response.send(404, "Failed to register.");
      } else {
        response.send();
      }
    });
  });
};

exports.blocks = blocks;
