cradle = require 'cradle'
config = require '../../config'
connection = new(cradle.Connection)(config.db.host, config.db.port, 
  cache: false,
  secure: true,
  auth: 
    username: config.db.username,
    password: config.db.password  
)
module.exports.db = connection.database config.db.name