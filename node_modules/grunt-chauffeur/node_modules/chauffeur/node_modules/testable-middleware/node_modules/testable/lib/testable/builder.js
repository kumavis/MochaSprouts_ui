var TestablePresenter = require('../presenter/testable'),
    path = require('path'),
    extend = require('extend'),
    TestableBuilder, defaults;

defaults = {
  framework: 'qunit',
  files: [],
  tests: []
};

TestableBuilder = module.exports = function TestableBuilder(config) {
  this.config = extend({}, defaults, config);
};

TestableBuilder.prototype.toHTML = function() {
  var data = { presenter: this.presenter(this.adapter()) };
  return this.render(data);
};

TestableBuilder.prototype.framework = function() {
  return this.config.framework || defaults.framework;
};

TestableBuilder.prototype.presenter = function(adapter) {
  return new TestablePresenter(adapter);
};

TestableBuilder.prototype.adapter = function() {
  var Adapter, adapter;
  if (this.config.adapter && typeof this.config.adapter === 'object') {
    return this.config.adapter;
  }
  try {
    Adapter = require('../adapter/' + this.framework().toLowerCase());
    adapter = new Adapter(this.config);
  } catch (e) {
    throw new Error('No adapter defined for ' + this.framework());
  }
  return adapter;
};

TestableBuilder.prototype.render = function(data) {
  return require('../template')(data);
};

