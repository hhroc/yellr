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


    if (mod.URLS !== undefined) {
      // load new data
      mod.utils.load('posts', mod.latest_posts.render_feed);
      mod.utils.load('messages');
      mod.utils.load('languages');
      // mod.utils.load('collections');
      // mod.utils.load('assignments');
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
      default:
        console.log('lol');
        break;
    }

    if (document.querySelector('#sidebar')) mod.utils.setup_sidebar();

}
