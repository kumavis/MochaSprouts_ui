// exists helper
Ember.Test.registerHelper('exists', function(app, selector, context) {
  return !!find(selector, context).length;
});
