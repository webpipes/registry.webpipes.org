path = require 'path'

environment = process.env.NODE_ENV or 'development'

exports.domain = 'registry.webpipes.org'

exports.port = process.env.PORT or 3001

exports.dirs = 
  assets        : path.join __dirname, 'assets'
  views         : path.join __dirname, 'app/views'
  controllers   : path.join __dirname, 'app/controllers'

exports.environment =
  production    : false
  staging       : false
  test          : false
  development   : false

exports.environment[environment] = true

if environment in ['production', 'staging']
  exports.logs = ':remote-addr - [:date] ":method :url :status :response-time ms'
else
  exports.logs = 'dev'

exports.db =
  host : process.env.DB_HOST
  port : 443
  name : process.env.DB_NAME
  username : process.env.DB_USERNAME
  password : process.env.DB_PASSWORD