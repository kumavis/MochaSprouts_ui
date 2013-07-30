var BaseAdapter = require('./base'),
    MochaAdapter;

MochaAdapter = module.exports = function MochaAdapter() {
  BaseAdapter.apply(this, arguments);
};

require('util').inherits(MochaAdapter, BaseAdapter);

MochaAdapter.prototype.css = function() {
  return ['mocha.css'];
};

MochaAdapter.prototype.libs = function() {
  return ['chai.js', 'mocha.js'];
};

MochaAdapter.prototype.markup = function() {
  return '<div id="mocha"></div>';
};

MochaAdapter.prototype.extras = function() {
  var chai = 'expect', style = 'bdd', assert,
      types = ['expect', 'assert', 'should'],
      styles = ['bdd', 'tdd', 'exports', 'qunit'];
  if (this.config.chai && types.indexOf(this.config.chai.toLowerCase()) !== -1) {
    chai = this.config.chai.toLowerCase();
  }
  if (chai === 'assert') {
    assert = "window.assert = chai.assert;";
  } else if (chai === 'expect') {
    assert = "window.expect = chai.expect;";
  } else if (chai === 'should') {
    assert = "chai.should();";
  }
  if (this.config.style && styles.indexOf(this.config.style.toLowerCase() !== -1)) {
    style = this.config.style.toLowerCase();
  }
  return ['', '<script>', assert, "mocha.setup('" + style + "');", '</script>', ''].join("\n");
};

MochaAdapter.prototype.startup = function() {
  return ['',
    '<script>',
    'if (window.mochaPhantomJS) { mochaPhantomJS.run(); }',
    'else { mocha.run(); }',
    '</script>',
  ''].join("\n");
};

