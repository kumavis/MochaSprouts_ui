var glob = require('glob'),
    BaseAdapter;

BaseAdapter = module.exports = function BaseAdapter(config) {
  this.config = config;
};

BaseAdapter.prototype.css = function() {
  return [];
};

BaseAdapter.prototype.libs = function() {
  return [];
};

BaseAdapter.prototype.markup = function() {
  return '';
};

BaseAdapter.prototype.extras = function() {
  return '';
};

BaseAdapter.prototype.startup = function() {
  return '';
};

BaseAdapter.prototype.files = function() {
  return this.expandPaths(this.config.files);
};

BaseAdapter.prototype.tests = function() {
  return this.expandPaths(this.config.tests);
};

BaseAdapter.prototype.expandPaths = function(files) {
  var ret = [], options = {};
  if (this.config.cwd) { options.cwd = this.config.cwd; }
  files.forEach(function(file) {
    ret = ret.concat(glob.sync(file, options));
  });
  return ret;
};

BaseAdapter.prototype.transformPath = function(file) {
  var converted = file;
  if (this.config.transformPath) {
    if (typeof this.config.transformPath === 'function') {
      converted = this.config.transformPath(file);
    } else if (typeof this.config.transformPath === 'string') {
      converted = file.replace(this.config.transformPath, '');
    }
  }
  return converted;
};

