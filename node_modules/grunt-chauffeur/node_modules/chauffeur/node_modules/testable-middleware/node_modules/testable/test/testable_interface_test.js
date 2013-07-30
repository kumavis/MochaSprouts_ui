var testable = require('../lib/testable');

exports.testable_interface = {
  testAssetsPath: function(test) {
    var regexp = new RegExp('.+\/node-testable\/data\/vendor');
    test.ok(regexp.test(testable.assetsPath()));
    test.done();
  },

  testMarkupQunit: function(test) {
    var config = {
      files: ['lib/adapter/**/*.js', 'lib/testable.js'],
      tests: ['test/**/*_test.js']
    };
    var regexp = new RegExp('qunit.css.+id="qunit".+id="qunit-fixture".+qunit.js.+');
    console.log(testable.markup(config));
    test.done();
  },

  testMarkupJasmine: function(test) {
    var config = {
      framework: 'jasmine',
      cwd: process.cwd() + '/lib',
      files: ['adapter/**/*.js', 'testable.js'],
      tests: ['test/**/*_test.js']
    };
    var regexp = new RegExp('jasmine.css.+jasmine.js.+jasmine-html.js.+jasmineEnv.execute.+');
    console.log(testable.markup(config));
    test.done();
  },

  testMarkupMocha: function(test) {
    var config = {
      framework: 'mocha',
      chai: 'expect',
      style: 'tdd',
      transformPath: 'lib/',
      files: ['lib/adapter/**/*.js', 'lib/testable.js'],
      tests: ['test/**/*_test.js']
    };
    var regexp = new RegExp('mocha.css.+id="mocha".+chai.js.+mocha.js.+chai.expect.+tdd.+');
    console.log(testable.markup(config));
    test.done();
  }
};
