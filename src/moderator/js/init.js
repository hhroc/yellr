'use strict';
var mod = mod || {};

var DEBUG = true;

window.onload = function () {

    // console.log('removing localStorage');
    // if (DEBUG) localStorage.removeItem('yellr-mod');

    // Handlebars check
    // ===================================

    // check for dependencies
    if (!Handlebars || !$) {
      console.log('missing dependencies for mod.utils.render_template');
      return;
    }

    // load our Handlebars halper
    // https://gist.github.com/doginthehat/1890659
    Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {

      if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

      operator = options.hash.operator || "==";

      var operators = {
        '==':   function(l,r) { return l == r; },
        '===':  function(l,r) { return l === r; },
        '!=':   function(l,r) { return l != r; },
        '<':    function(l,r) { return l < r; },
        '>':    function(l,r) { return l > r; },
        '<=':   function(l,r) { return l <= r; },
        '>=':   function(l,r) { return l >= r; },
        'typeof': function(l,r) { return typeof l == r; }
      }

      if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

      var result = operators[operator](lvalue,rvalue);

      if( result ) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }

    });

    // ----------------------------



    // check for pre-existing data, if none, create it
    if (localStorage.getItem('yellr-mod') === null) {

      // get auth token
      // - redirect to login page
      mod.utils.redirect_to_login('Missing authentication token. Please login to continue');

    } else {

      mod.utils.load_localStorage();

    }


    /* this bit should probably be changed. we don't need to load data every time a page loads.. */
    if (mod.URLS !== undefined) {

      // load new data
      mod.utils.load({
        data: 'get_posts',
        saveAs: 'posts',
        // callback: mod.latest_posts.render_feed
      });
      // mod.utils.load('messages');
      mod.utils.load({
        data: 'get_languages',
        saveAs: 'languages'
      });
      mod.utils.load({
        data: 'get_my_assignments',
        saveAs: 'assignments',
        // callback: mod.latest_posts.render_active_assignments
      });
      // mod.utils.load('collections');
    }


    // get our current page
    mod.PAGE = document.querySelector('body').getAttribute('data-page');

    // do specfic things for each page
    switch (mod.PAGE) {
      case 'login':
        mod.utils.login();
        break;
      case 'posts':
        mod.latest_posts.init();
        break;
      case 'assignments':
        mod.assignments.init();
        break;
      case 'single-assignment':
        mod.assignments.view();
        break;
      case 'editor':
        mod.editor.init();
        break;
      case 'collections':
        // setup collections page
        // hook up the buttons
        document.querySelector('#new-collection-btn').onclick = function (e) {

          mod.utils.show_overlay({template: '#collections-form-template'});
          mod.collections.setup_form();

        }
        document.querySelector('#delete-collection-btn').onclick = function (e) {
          console.log('delete collection');
        }

        mod.collections.view_all();

        break;
      case 'messages':

        // // setup inbox
        // mod.messages.init({
        //   data_url: mod.URLS.messages,
        //   template: '#inbox-li',
        //   container: '#inbox',
        //   read_target: '#read-mail-list',
        //   unread_target: '#unread-mail-list'
        // });

        // hook up the button
        document.querySelector('#new-message-btn').onclick = function() {
          mod.messages.create_message();
        }
        break;

      default:
        console.log('lol');
        break;
    }

    if (document.querySelector('#sidebar')) mod.utils.setup_sidebar();

}
