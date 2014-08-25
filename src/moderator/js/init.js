'use strict';
var mod = mod || {};

window.onload = function () {

    // check for dependencies
    if (!Handlebars || !$) {
      console.log('missing dependencies for mod.utils.render_template');
      return;
    }

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
        url: 'http://yellrdev.wxxi.org/admin/get_languages.json?token='+mod.TOKEN,
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
    if (mod.PAGE === 'login') mod.login.init();
    if (mod.PAGE === 'posts') mod.latest_posts.init();

    mod.utils.main_setup();


}
