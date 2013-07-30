var ejs = require('ejs'),
    path = require('path'),
    fs = require('fs'),
    filePath = path.join(path.dirname(__dirname), 'data', 'test.ejs');

module.exports = function(data) {
  return ejs.render(fs.readFileSync(filePath, { encoding: 'utf8' }), data);
};
