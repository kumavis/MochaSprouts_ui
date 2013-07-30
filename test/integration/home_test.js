module('Home test', {
  setup: function() {
    App.reset();
  }
});

test('has header', function() {
  visit('/').then(function() {
    ok(exists('h1:contains(Ember-Grunt-Init)'), 'Default header exists');
  });
});
