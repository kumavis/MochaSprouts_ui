var TestablePresenter;

TestablePresenter = module.exports = function TestablePresenter(adapter) {
  this.adapter = adapter;
};

TestablePresenter.prototype.css = function() {
  var content = this.adapter.css().reduce(this.reduceLink.bind(this), '');
  return this.filterFiles('css').reduce(this.reduceLink.bind(this), content).trim();
};

TestablePresenter.prototype.libs = function() {
  var content = this.adapter.libs().reduce(this.reduceScript.bind(this), '');
  return this.filterFiles('js').reduce(this.reduceScript.bind(this), content).trim();
};

TestablePresenter.prototype.tests = function() {
  return this.adapter.tests().map(function(test) {
    return this.adapter.transformPath(test);
  }.bind(this)).reduce(this.reduceScript.bind(this), '').trim();
};

TestablePresenter.prototype.startup = function() {
  return this.adapter.startup();
};

TestablePresenter.prototype.extras = function() {
  return this.adapter.extras();
};

TestablePresenter.prototype.markup = function() {
  return this.adapter.markup();
};

TestablePresenter.prototype.filterFiles = function(ext) {
  var regexp = new RegExp('.+\\.' + ext + '$');
  return this.adapter.files().filter(function(file) {
    return regexp.test(file);
  }.bind(this)).map(function(file) {
    return this.adapter.transformPath(file);
  }.bind(this));
};

TestablePresenter.prototype.link = function(file) {
  return ['<link rel="stylesheet" href="', file, '">'].join('');
};

TestablePresenter.prototype.script = function(file) {
  return ['<script src="', file, '"></script>'].join('');
};

TestablePresenter.prototype.reduceLink = function(prev, file) {
  return prev + this.link(file) + "\n";
};

TestablePresenter.prototype.reduceScript = function(prev, file) {
  return prev + this.script(file) + "\n";
};

