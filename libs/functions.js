var functions = {};
var http = require('http');
var url = require('url');
var express = require('express');
var _ = require('underscore');
var errors = require('./errors.js').errors;

// Cross-Origin Resource Sharing middleware
functions.allowCrossDomain = function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET');
    response.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
};

// Simple logger
functions.logRequests = function (request, response, next) {
    console.log('%s %s', request.method, request.url);
    next();
};

// Safely exit
functions.exit = function (message) {
    if (message) {
        console.log(message);
    }
    console.log('Exiting...');
    process.exit(1);
};

// Fetch and validate the Block definition.
functions.getBlockDefinition = function (definitionURL, callback) {
    var parsedURL = url.parse(definitionURL);
    var options = {
        hostname: parsedURL.hostname,
        path: parsedURL.path,
        method: 'OPTIONS'
    };

    var request = http.request(options, function (response) {
        response.setEncoding('utf8');
        response.on('data', function (definition) {
            if (response.statusCode !== 200) {
                callback(errors.BLOCKDEF_INVALID_STATUS)
            } else {
                functions.validateBlockDefinition(response, callback);
            }
        });
    })

    request.on('error', function (err) {
        callback(errors.BLOCKDEF_FAILED);
    });

    request.end();
};

// Validate a Block Definition against the official specification.
functions.validateBlockDefinition = function (response, callback) {
	// Check CORS 
	
	var def = response.body;
	console.log(def);
	//Check for required 
    if (!_.has(def, 'name') && _.isString(def.name)) {
        callback(errors.BLOCKDEF_INVALID_NAME);
    } else if (!_.has(def, 'description') && _.isString(def.description)) {
        callback(errors.BLOCKDEF_INVALID_DESCRIPTION);
    } else if (!_.has(def, 'inputs') && _.isArray(def.inputs)) {
        callback(errors.BLOCKDEF_INVALID_INPUTS);
    } else if (!_.has(def, 'outputs') && _.isArray(def.outputs)) {
        callback(errors.BLOCKDEF_INVALID_OUTPUTS);
    } else {
        callback(false, JSON.parse(def));
    }
};

// Slugs are db keys and url-friendly versions of a block's definition.name
functions.getSlug = function (name) {
    return name.toLowerCase()
        .replace(' ', '-')
        .replace(/[^A-Za-z0-9-]/g, '');
};

// Remove 'X-Powered-By' from headers, and set others if necessary
functions.handleHeaders = function (request, response, next) {
  response.removeHeader('X-Powered-By');
  next();
};

exports.functions = functions;