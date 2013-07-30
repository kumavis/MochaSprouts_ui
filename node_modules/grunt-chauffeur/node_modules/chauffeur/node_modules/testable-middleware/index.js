var testable = require('testable'),
    connect = require('connect');

exports.attach = function(app, config) {
  var route = config.route || '/test.html';

  if (route[0] !== '/') { route = '/' + route; }

  app.use(connect.static(testable.assetsPath()));
  app.use(function testableMiddleware(req, res, next) {
    if (new RegExp('^' + route).test(req.url)) {
      res.setHeader('Content-Type', 'text/html');
      res.end(testable.markup(config));
    } else {
      next();
    }
  });
};

