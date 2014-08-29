'use strict';
var mod = mod || {};

var DEBUG = true;

window.onload = function () {

    // console.log('removing localStorage');
    // if (DEBUG) localStorage.removeItem('yellr-mod');

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
    if (localStorage.getItem('yellr-mod') === null) localStorage.setItem('yellr-mod', JSON.stringify({TOKEN: undefined, LANGUAGES: {}, DATA: {} }));

    // get auth token
    var local = JSON.parse(localStorage.getItem('yellr-mod'));
    mod.TOKEN = local.TOKEN;
    mod.LANGUAGES = local.LANGUAGES;
    console.log(local.DATA);
    mod.DATA = local.DATA;


    // check that we have a valid token, that hasn't expired
    // TODO: check if the token has expire
    if (mod.TOKEN === undefined) {
      // redirect to login page, if we're not there already
      if (document.querySelector('body').getAttribute('data-page') !== 'login') {
        /* TODO: use a real url */
        alert('Must login. Missing authentication token.');
        window.location.replace('http://127.0.0.1:8000/moderator/login.html');
      }
    }

    if (mod.LANGUAGES === undefined) {
      // make call to get_languages API
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8080/admin/get_languages.json?token='+mod.TOKEN,
        // url: 'http://yellrdev.wxxi.org/admin/get_languages.json?token='+mod.TOKEN,
        dataType: 'json',
        success: function (data) {
          if (data.success) {
            mod.LANGUAGES = data.languages;
            mod.utils.save();
          } else {
            if (document.querySelector('body').getAttribute('data-page') !== 'login') {
              /* TODO: use a real url */
              alert('Must login. Missing authentication token.');
              window.location.replace('http://127.0.0.1:8000/moderator/login.html');
            }
          }
        }
      });
    }

    // ----------------------------


    // setup data object
    mod.data.init();


    // get current page
    mod.PAGE = document.querySelector('body').getAttribute('data-page');
    switch (mod.PAGE) {
      case 'login':
        mod.login.init();
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

    mod.utils.main_setup();


}
