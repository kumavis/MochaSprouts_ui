# Testable

Library that generates the html for a browser test runner.

## Usage

	var testable = require('testable');
	
	// Get the final html string (default is qunit)
	testable.markup();
	
	// Get markup for jasmine test runner.
	testable.markup({ framework: 'jasmine' });
	
	// Get the absolute path to a the directory of bundled assets
	testable.assetsPath();
	
## Config

### config.framework

Set what built in test framework adapter to use.

Bundled adapters: `qunit` (default), `jasmine`, and `mocha`.

### config.files

Array of strings that are the files to be loaded in the test runner. These strings are passed through [node-glob](https://github.com/isaacs/node-glob). Files included here are filtered, and css files are included in the page `head`, and js files are included in order in the page `body`.

### config.tests

Array of strings that works exactly like `files`. This should include the files that have your tests. `files` and `tests` have to be separate because code can be injected in between the files script tags and the tests script tags.

### config.transformPath

This options can be a string or a function. In the resulting html, the paths to the files in the `files` configuration will be relative to `process.cwd()`. Those paths may not be reachable by the browser depending on how the webserver is setup. `transformPath` can modify each path to something that is reachable.

When `transformPath` is a string, it is used as the search in a call to `String.replace()`. If the `files` option is set to `['tmp/build/js/**/*.js']` and `transformPath` is `tmp/build/`, then in the browser, the script tag src attributes will be `js/...`.

`transformPath` can also be a function which gets the src path as a param and returns the path that should be set in the browser.

### config.adapter

See section at the bottom about custom adapters.

### config.chai (mocha framework only)

When using the `mocha` framework, the `chai` configuration option is used to choose what type of assertion style to use with chai. See [chaijs.org](http://chaijs.com/) for more information. Valid options are `expect` (default), `assert`, and `should`.

### config.style (mocha framework only)

When using the `mocha` framework, the `style` configuration option is used to set the spec syntax for mocha. See [mocha interfaces](http://visionmedia.github.io/mocha/#interfaces) for more information. Valid options are `bdd` (default), `tdd`, `exports`, and `qunit`.

## Example

Here is a quick example app using [Express.js](http://expressjs.com/).

	var express = require('express'),
		testable = require('testable'),
		app = express(), testableConfig;
		
	testableConfig = {
		framework: 'qunit',
		files: ['public/js/app.js'],
		tests: ['public/test/**/*_test.js'],
		transformPath: 'public/'
	};
	
	// Make testable assets available
	app.use(express.static(testable.assetsPath()));
	app.use(express.static(__dirname + '/public'));
	
	app.get('/test.html', function(req, res) {
		res.setHeader('Content-Type', 'text/html');
		res.end(testable.markup(testableConfig));
	});
	
	app.listen(8000);
	
Also check out [testable-middleware](https://github.com/joeytrapp/node-testable-middleware) to use testable with Connect or Express.

## Custom Adapters

To add support for new testing frameworks, or your own framework, you could create a custom adapter. An adapter is simply an object that exposes five methods:

	adapter: {
		css: function() { return ['custom.css']; },
		libs: function() { return ['custom.js']; },
		markup: function() {
			return '<div id="custom-framework"></div>';
		},
		extras: function() {
			return '<script>MyFramework.setup(config);</script>';
		},
		startup: function() {
			return '<script>MyFramework.run();</script>';
		}
	}

### adapter.css

An array of css files necessary for the test framework.

### adapter.libs

An array js files necessary for the test framework.

### adapter.markup

Most frameworks require a small html snippet added to the body. The string returned from `adapter.markup()` is the first thing added to the test runner body tag.

### adapter.extras

The string returned from this method is added to the test runner markup between the `config.files` script tags and the the `config.tests` script tags.

### adapter.startup

The string returned from this method is the last thing added to the test runner.