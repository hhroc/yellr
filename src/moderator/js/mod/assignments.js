'use strict';
var mod = mod || {};

mod.assignments = (function() {


  var init = function () {
    console.log('hello from: assignments.init');
    console.log('look at all the assignments you\'ve posted');
  }

  var view = function () {
    console.log('hello from: assignments.view');
  }

  return {
    init: init,
    view: view
  }
})();
