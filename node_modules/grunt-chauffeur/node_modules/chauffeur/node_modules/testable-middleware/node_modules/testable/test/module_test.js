var testable = require('../index.js');

exports.module = {
  testModuleExposesMethods: function(test) {
    test.ok(typeof testable.markup === 'function', 'Markup method exists');
    test.ok(typeof testable.assetsPath === 'function', 'AssetsPath method exists');
    test.done();
  }
};
