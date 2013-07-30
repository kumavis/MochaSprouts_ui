var BaseAdapter = require('./base'),
    QunitAdapter;

QunitAdapter = module.exports = function QunitAdapter() {
  BaseAdapter.apply(this, arguments);
};

require('util').inherits(QunitAdapter, BaseAdapter);

QunitAdapter.prototype.css = function() {
  return ['qunit.css'];
};

QunitAdapter.prototype.libs = function() {
  return ['qunit.js'];
};

QunitAdapter.prototype.markup = function() {
  return '<div id="qunit"></div><div id="qunit-fixture"></div>';
};

