var BaseAdapter = require('./base'),
    JasmineAdapter;

JasmineAdapter = module.exports = function JasmineAdapter() {
  BaseAdapter.apply(this, arguments);
};

require('util').inherits(JasmineAdapter, BaseAdapter);

JasmineAdapter.prototype.css = function() {
  return ['jasmine.css'];
};

JasmineAdapter.prototype.libs = function() {
  return ['jasmine.js', 'jasmine-html.js'];
};

JasmineAdapter.prototype.startup = function() {
  return ['',
    '<script>(function() {',
    '  var jasmineEnv = jasmine.getEnv();',
    '  jasmineEnv.updateInterval = 1000;',
    '  var htmlReporter = new jasmine.HtmlReporter();',
    '  jasmineEnv.addReporter(htmlReporter);',
    '  jasmineEnv.specFilter = function(spec) {',
    '    return htmlReporter.specFilter(spec);',
    '  };',
    '  var currentWindowOnload = window.onload;',
    '  window.onload = function() {',
    '    if (currentWindowOnload) {',
    '      currentWindowOnload();',
    '    }',
    '    execJasmine();',
    '  };',
    '  function execJasmine() {',
    '    jasmineEnv.execute();',
    '  }',
    '})();</script>',
  ''].join("\n");
};

