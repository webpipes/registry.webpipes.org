var cradle = require('cradle');
var dbConnection = new(cradle.Connection)(process.env.dbHost, process.env.dbPort, {
  cache: false,
  secure: true,
  auth: {
    username: process.env.dbUsername,
    password: process.env.dbPassword
  }
});
exports.db = dbConnection.database(process.env.dbName);