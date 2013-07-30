var path = require('path'),
    TestableBuilder = require('./testable/builder');

exports.markup = function(config) {
  var testable = new TestableBuilder(config);
  return testable.toHTML();
};

exports.assetsPath = function() {
  return path.join(path.dirname(__dirname), 'data', 'vendor'); 
};

