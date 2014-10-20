'use strict';
var yellr = yellr || {};

var BASE_URL = '/',
    AUTO_REFRESH = true;


window.onload = function () {

    // Handlebars check
    // -----------------------------
    if (!Handlebars || !$) {
      console.log('missing dependencies for yellr.utils.render_template');
      return;
    }
    // ----------------------------



    // check for pre-existing data, if none, create it
    if (localStorage.getItem('yellr-mod') === null) yellr.utils.redirect_to_login();
    else yellr.utils.load_localStorage();

    // make sure we have our DATA object setup
    if (yellr.DATA === undefined) yellr.DATA = {};

    // get our current page
    var page = document.querySelector('body').getAttribute('data-page');

    // do specfic things for each page
    switch (page) {
      case 'index':
        // the dashboard
        yellr.view.index();
        break;
      case 'login':
        yellr.view.login();
        break;
      case 'assignments':
        yellr.view.assignments_page();
        break;
      case 'single-assignment':
        yellr.view.single_assignment_view();
        break;
      case 'editor':
        yellr.editor.init();
        break;
      case 'collections':
        yellr.view.collections_page();
        break;
      case 'single-collection':
        yellr.view.single_collection_view();
        break;
      case 'messages':
        yellr.view.inbox();
        break;
      default:
        console.log('lol ok');
        break;
    }

    if (document.querySelector('#sidebar')) yellr.utils.setup_sidebar();

}
