var pages = {};

pages.home = function (request, response) {
  response.render('pages/home.html', {
    title: "WebPipe Registry"
  });
};

pages.about = function (request, response) {
  response.render('pages/about.html', {
    title: "About"
  });
};

exports.pages = pages;