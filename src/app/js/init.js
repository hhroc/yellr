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

  // if (DEBUG) localStorage.removeItem('yellr');

  // check for a UUID,
  // - if none create it
  // - set default app settings

  // check for pre-existing data, if none, create it
  if (localStorage.getItem('yellr') === null) {

    // create a new user ID
    yellr.UUID = yellr.utils.guid();

    // default settings
    yellr.SETTINGS = {
      // default to Rochester, NY
      lat: 43.2,
      lng: -77.6,
      language: {
        code: 'en',
        name: 'English',
        set: function(lang) {
          // pass in a code from Cordova api
          this.code = lang;

          // decipher
          if (lang === 'en') this.name = 'English';  // *
          if (lang === 'es') this.name = 'Español';  // *
          if (lang === 'fr') this.name = 'French';   // *

          // * - from HTC Inspire (Android)
        }
      },
      app: {
        // to do
        // phone specific settings
      }
    };

    // set our API urls
    // ** TO EDIT API URLS GO TO utils.js and change the set_urls function **
    yellr.URLS = yellr.utils.set_urls();

    yellr.utils.save();

  } else {

    // we ave existing local storage, load it
    yellr.utils.load_localStorage();

  }

  // ping server for new data
  yellr.utils.load('assignments', yellr.view.assignments.render_feed);
  yellr.utils.load('notifications');
  yellr.utils.load('messages');


  // set up routes
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
