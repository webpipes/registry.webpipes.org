var controllers = {};
controllers.pages = require('./pages.controller.js').pages;
controllers.blocks = require('./blocks.controller.js').blocks;
exports.controllers = controllers;