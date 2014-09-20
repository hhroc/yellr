'use strict';
var yellr = yellr || {};

/*
  We call our setup functions as soon as we're ready
  They are fired in the following sequence:
    1. onload()
    2. deviceready()
*/

// var DEBUG = true;
var DEBUG = false;

window.onload = function() {

  // if (DEBUG) localStorage.removeItem('yellr');
  localStorage.removeItem('yellr');

  // check for pre-existing data, if none, create it
  if (localStorage.getItem('yellr') === null) {
    yellr.utils.create_user();
    yellr.utils.save();
  } else {
    // we ave existing local storage, load it
    yellr.utils.load_localStorage();
  }


  // check version info
  yellr.utils.check_version();


  // ping server for new data
  yellr.utils.load('assignments', yellr.view.assignments.render_feed);
  yellr.utils.load('notifications', yellr.utils.check_notifications);
  yellr.utils.load('messages', yellr.utils.check_messages);
  yellr.utils.load('stories', yellr.view.stories.render_feed);


  // set up routes
  yellr.routes.init();

  // extras
  // FastClick.attach(document.body);


  document.addEventListener('deviceready', function() {
    // yellr.user.cordova();
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
