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


    // logout button
    document.querySelector('#logout-btn').onclick = yellr.utils.logout;
    // cosmetic things
    document.querySelector('#sidebar').setAttribute('style', 'min-height: '+document.querySelector('body').scrollHeight+'px');



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
      case 'create-assignment':
        yellr.view.create_assignment();
        break;
      case 'assignments':
        yellr.view.all_assignments();
        break;
      case 'single-assignment':
        yellr.view.single_assignment_view();
        break;
      case 'editor':
        yellr.editor.init();
        break;
      case 'collections':
        yellr.view.all_collections();
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

}
