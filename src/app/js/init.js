'use strict';
var yellr = yellr || {};

/*
  We call our setup functions as soon as we're ready
  They are fired in the following sequence:
    1. onload()
    2. deviceready()
*/

window.onload = function() {
  /* DEBUG MODE */
  // localStorage.removeItem('yellr');

  // setup
  yellr.setup.DOM();
  yellr.route('#');

  if (yellr.localStorage === undefined) {
    console.log('setting dev local storage');
    yellr.localStorage = {
      client_id: '123456789'
    }
  }


  // load assignments
  $.getJSON('data/assignments.json', function(data) {
    yellr.utils.render_list({
      data: data,
      target: '#latest-assignments',
      prepend: true
    });
  });
}

document.addEventListener('deviceready', function() {
  yellr.setup.user();
  yellr.setup.app();
}, false);
