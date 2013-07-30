//= require_tree ./lib
//= require_self
//= require_tree ./unit
//= require_tree ./integration

EmberTestingUI.init(App);

Ember.run(App, App.advanceReadiness);
