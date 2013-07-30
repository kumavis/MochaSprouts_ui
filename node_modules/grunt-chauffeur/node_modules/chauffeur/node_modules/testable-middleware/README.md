# testable-middleware

Connect or Express middleware to easily attach [testable](https://github.com/joeytrapp/node-testable) to a route.

## Usage

    var express = require('express'),
        testable = require('testable-middleware'),
        app = express(),
        config = {
            route: '/test.html',
            // any other configurations to pass on to testable;
        };

    testable.attach(app, config);

    // other routes

    app.listen(8000);

The `attach()` method adds the testable vendor directory as a static file directory and adds the `testableMiddleware` handler for the supplied route (defaults to '/test.html'). The configuration object is passed along to testable. See [testable docs](https://github.com/joeytrapp/node-testable) for more information about options to pass to testable.
