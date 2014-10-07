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
    // yellr.cordova.getLatitude();
    // yellr.cordova.getLongitude();


    // // Location API
    // navigator.geolocation.getCurrentPosition(function(position) {
    //   // success geting location

    //   yellr.utils.notify('Latitude: ' + position.coords.latitude);
    //   yellr.SETTINGS.lat = position.coords.latitude;

    //   yellr.utils.notify('Longitude: ' + position.coords.longitude);
    //   yellr.SETTINGS.lng = position.coords.longitude;


    //   // document.querySelector('#cordova-position').innerHTML = '' +
    //   //   'Latitude           |' + position.coords.latitude + '<br />' +
    //   //   'Longitude          |' + position.coords.longitude + '<br />' +
    //   //   'Altitude           |' + position.coords.altitude + '<br />' +
    //   //   'Accuracy           |' + position.coords.accuracy + '<br />' +
    //   //   'Altitude Accuracy  |' + position.coords.altitudeAccuracy + '<br />' +
    //   //   'Heading            |' + position.coords.heading + '<br />' +
    //   //   'Speed              |' + position.coords.speed + '<br />' +
    //   //   'Timestamp          |' + position.timestamp + '<br />';
    // }, function(error) {
    //   // error getting location
    //   yellr.utils.notify(error.message);
    //   // document.querySelector('#cordova-position').innerHTML = '' +
    //   //   'Error Code   |' + error.code + '<br/>' +
    //   //   'Message      |' + error.message;
    // });




  }, false);

}
