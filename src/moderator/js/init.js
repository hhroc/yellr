'use strict';
var mod = mod || {};

var DEBUG = true;
// var BASE_URL = 'http://127.0.0.1:8080/';
var BASE_URL = '/';

window.onload = function () {

    // Handlebars check
    // -----------------------------
    if (!Handlebars || !$) {
      console.log('missing dependencies for mod.utils.render_template');
      return;
    }
    // ----------------------------



    // check for pre-existing data, if none, create it
    if (localStorage.getItem('yellr-mod') === null) mod.utils.redirect_to_login('Missing authentication token. Please login to continue');
    else mod.utils.load_localStorage();

    // make sure we have our DATA object setup
    if (mod.DATA === undefined) mod.DATA = {};

    // get our current page
    mod.PAGE = document.querySelector('body').getAttribute('data-page');

    // do specfic things for each page
    switch (mod.PAGE) {
      case 'index':
        mod.setup.dashboard();
        break;
      case 'login':
        mod.setup.login();
        break;
      case 'assignments':
        mod.setup.assignments_page();
        break;
      case 'single-assignment':
        mod.setup.assignment_overview();
        break;
      case 'editor':
        mod.editor.init();
        break;
      case 'collections':
        mod.setup.collections_page();
        break;
      case 'single-collection':
        mod.setup.single_collection_view();
        break;
      case 'messages':
        mod.setup.inbox();
        break;
      default:
        console.log('lol ok');
        break;
    }

    if (document.querySelector('#sidebar')) mod.utils.setup_sidebar();

}
