exports.setup = (app) ->
  controller = new exports.StaticController
  app.get '/', controller.index
  app.get '/about', controller.about

class exports.StaticController
  
  index: (request, response) ->
    response.render 'pages/home', 
      title: "WebPipe Registry"

  about: (request, response) ->
    response.render 'pages/about', 
      title: "About"
