'use strict';
var yellr = yellr || {};

/*
  We call our setup functions as soon as we're ready
  They are fired in the following sequence:
    1. onload()
    2. deviceready()
*/

var DEBUG = true;
var BASE_URL = 'http://yellrdev.wxxi.org/';

window.onload = function() {

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
  moment.locale(yellr.SETTINGS.language.code);

  document.addEventListener('deviceready', function() {
    // do cordova setup things
  }, false);

}
