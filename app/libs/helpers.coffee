http = require 'http'
url = require 'url'
_ = require 'underscore'
errors = require('./errors').errors

# Cross-Origin Resource Sharing middleware
exports.allowCrossDomain = (request, response, next) ->
  response.header 'Access-Control-Allow-Origin', '*' 
  response.header 'Access-Control-Allow-Methods', 'GET' 
  response.header 'Access-Control-Allow-Headers', 'X-Requested-With' 
  next()

# Safely exit
exports.exit = (message) ->
  if message
    console.warn(message);

  console.warn('\nExiting...');
  process.exit(1);

# Fetch and validate the Block definition.
exports.getBlockDefinition = (definitionURL, callback) ->
  parsedURL = url.parse definitionURL
  options = 
    hostname: parsedURL.hostname,
    path: parsedURL.path,
    method: 'OPTIONS'

  request = http.request options, (response) ->
    response.setEncoding 'utf8' 
    response.on 'data', (definition) ->
      if response.statusCode is not 200
        callback errors.BLOCKDEF_INVALID_STATUS
      else
       exports.validateBlockDefinition definition, callback

  request.on 'error', (err) ->
    callback errors.BLOCKDEF_FAILED

  request.end()

# Validate a Block Definition against the official specification.
# TODO: Check CORS 
exports.validateBlockDefinition = (def, callback) ->
  # Check for required 
  if not _.has(def, 'name') and _.isString(def.name)
    callback errors.BLOCKDEF_INVALID_NAME
  else if not _.has(def, 'description') and _.isString(def.description)
    callback errors.BLOCKDEF_INVALID_DESCRIPTION
  else if not _.has(def, 'inputs') and _.isArray(def.inputs)
    callback errors.BLOCKDEF_INVALID_INPUTS
  else if not _.has(def, 'outputs') and _.isArray(def.outputs)
    callback errors.BLOCKDEF_INVALID_OUTPUTS
  else
    callback false, JSON.parse(def)

# Slugs are db keys and url-friendly versions of a block's definition.name
exports.getSlug = (name) ->
  name.toLowerCase()
    .replace / /g, '-'
    .replace /[^A-Za-z0-9-]/g, ''

