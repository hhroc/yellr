'use strict';
var yellr = yellr || {};

// initial settings
yellr.BASE_URL = '/';
yellr.AUTO_REFRESH = true;


window.onload = function () {

    // Handlebars check
    // -----------------------------
    if (!Handlebars || !$) {
      console.log('missing dependencies for yellr.utils.render_template');
      return;
    }
    // ----------------------------


    var body, page, sidebar;


    // check for pre-existing data, if none, create it
    if (localStorage.getItem('yellr-mod') === null) yellr.utils.redirect_to_login();
    else yellr.utils.load_localStorage();

    // make sure we have our DATA object setup
    if (yellr.DATA === undefined) yellr.DATA = {};


    // get our current page
    body = document.querySelector('body');
    page = body.getAttribute('data-page');

    // do specfic things for each page
    switch (page) {
      case 'index':
        // the dashboard and everything
        yellr.view.index.init();
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
        yellr.view.view_assignment();
        break;
      case 'write-article':
        yellr.view.write_article();
        break;
      case 'collections':
        yellr.view.all_collections();
        break;
      case 'single-collection':
        yellr.view.view_collection();
        break;
      case 'messages':
        yellr.view.inbox();
        break;
      default:
        console.log('lol ok');
        break;
    }


    // hookup the Yellr admin sidebar
    sidebar = document.querySelector('#sidebar');
    if (sidebar) {
      // logout button
      document.querySelector('#logout-btn').onclick = function (event) {
        yellr.utils.logout();
      };

      // cosmetic things
      // - make sure the sidebar takes up the whole screen
      if(body.scrollHeight > sidebar.scrollHeight) sidebar.setAttribute('style', 'min-height: '+body.scrollHeight+'px');

    }



}
