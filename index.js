var express = require('express');
var app = express();
var controllers = require('./controllers/index.js').controllers;
var functions = require('./libs/functions.js').functions;

// Handle uncaughtException
process.on('uncaughtException', function (error) {
  functions.exit('Application Error: ' + error.message);
});

app.configure(function () {
  app.engine('.html', require('jade').__express);
  app.set('view engine', 'html');
  app.use(express.bodyParser());
  app.use(functions.allowCrossDomain);
  app.use(functions.logRequests);
  app.use(express.static(__dirname + '/public'));
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
});

app.configure('development', function () {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

app.get('/', controllers.pages.home);
app.get('/pages/about', controllers.pages.about);
app.get('/blocks.:format?', controllers.blocks.readAll);
app.get('/blocks/:name.:format?', controllers.blocks.readByName);
app.post('/blocks', controllers.blocks.register);

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("registry.webpipes.org: Listening on " + port);
});