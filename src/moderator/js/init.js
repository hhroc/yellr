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
    if (localStorage.getItem('yellr-mod') === null) localStorage.setItem('yellr-mod', JSON.stringify({TOKEN: undefined, LANGUAGES: undefined }));

    // get auth token
    var local = JSON.parse(localStorage.getItem('yellr-mod'));
    mod.TOKEN = local.TOKEN;
    mod.LANGUAGES = local.LANGUAGES;

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
          mod.LANGUAGES = data.languages;
        }
      });
    }

    // ----------------------------

    // get current page
    var page = document.querySelector('body').getAttribute('data-page');
    if (page === 'login') mod.login.init();
    else mod.utils.main_setup();


    // $.ajax({type: 'POST', url: 'http://yellrdev.wxxi.org/admin/get_posts.json?token=26426e96-1fa0-4d25-ba66-7258fd77996e', dataType: 'json', success: function (data) {console.log(data); } });

}
