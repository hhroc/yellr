'use strict';
var yellr = yellr || {};

/*
  We call our setup functions as soon as we're ready
  They are fired in the following sequence:
    1. onload()
    2. deviceready()
*/

var DEBUG = true;

window.onload = function() {

  if (DEBUG) localStorage.removeItem('yellr');

  // check for pre-existing data, if none, create it
  if (localStorage.getItem('yellr') === null) localStorage.setItem('yellr', JSON.stringify({DATA: {}, SETTINGS: {}, UUID: undefined}));

  // get saved data
  var data = JSON.parse(localStorage.getItem('yellr'));
  // set values for DATA, SETTINGS, UUID
  yellr.DATA = data.DATA;
  yellr.SETTINGS = data.SETTINGS;
  yellr.UUID = data.UUID;


  /** MUST RUN INITS() IN THIS ORDER **/
  /*  a user ID must exists before we can load data for it */
  if (yellr.UUID === undefined) {
    /**
     * - setup user things                js/yellr/user.js
     * - ping the server and load data    js/yellr/data.js
     */

    yellr.user.init();
    yellr.data.init();
    // update the local storage
    yellr.utils.save();
  }




  // set up routes
  // - js/yellr/routes.js
  yellr.routes.init();
  // extras
  // FastClick.attach(document.body);


  document.addEventListener('deviceready', function() {
    yellr.user.cordova();
    // alert('running deviceready');
    // // yellr.setup.user();
    // // yellr.setup.app();
    // // hide splash screen
    // // navigator.splashscreen.hide();

    // if (navigator.notification) { // Override default HTML alert with native dialog
    //   window.alert = function (message) {
    //     navigator.notification.alert(
    //       message,    // message
    //       null,       // callback
    //       "Workshop", // title
    //       'OK'        // buttonName
    //     );
    //   };
    // }

    // alert('this should look a little different?');

  }, false);

}

// document.addEventListener('deviceready', function() {
//   // yellr.setup.user();
//   yellr.user.cordova();
//   // yellr.setup.app();
//   // hide splash screen
//   // navigator.splashscreen.hide();

// }, false);
