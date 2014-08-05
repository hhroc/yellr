'use strict';
var yellr = yellr || {};

yellr.routes = function() {
    /**
     * routes.js
     *
     * exposes a Flask-like API that allows us to call a function based on the page we're on
     */
    console.log('hello from: routes.js');

    var init = function() {
      console.log('on hashchange call yellr.view');
    }

    var route = function(hash, func) {
      console.log('route set: ' + hash);
    }

    var view = function() {
      // called on window.hashchange
      console.log('view: ' );
    }

    return {
      init: init,
      route: route
    }
}()
