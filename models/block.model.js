var block = {};
var _ = require('underscore');
var db = require('./database.js').db;
var functions = require('../libs/functions.js').functions;

block.readAll = function (callback) {
  db.view("webpipes/all", function (err, result) {
    var result = _.map(_.pluck(result, 'value'), function (definition) {
      return _.omit(definition, ['_rev', '_id', 'type']);
    });
    callback(err, result);
  });
};

block.readByName = function (name, callback) {
  db.get(name, function (err, definition) {
    callback(err, _.omit(definition, ['_rev', '_id', 'type']));
  });
};

block.create = function (definition, callback) {
  var key = functions.getSlug(definition.name);
  definition.type = 'webpipe';
  db.save(key, definition, function (err, res) {
    callback(err, res);
  });
};

exports.block = block;