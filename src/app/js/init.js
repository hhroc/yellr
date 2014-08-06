'use strict';
var yellr = yellr || {};

/*
  We call our setup functions as soon as we're ready
  They are fired in the following sequence:
    1. onload()
    2. deviceready()
*/


// create 'global' variables
// yellr.view = {};
// yellr.user = {};


window.onload = function() {



  // set up routes
  // - js/yellr/routes.js
  yellr.routes.init();


  // set up user profile
  /**
   * yellr.user = {
   *   settings: {}
   *   notifications: [],
   *   messages: [],
   *   badges: []
   * }
   */


}

document.addEventListener('deviceready', function() {
  yellr.setup.user();
  yellr.setup.app();
}, false);
