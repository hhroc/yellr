'use strict';
var mod = mod || {};

mod.login = (function() {

    var form;

    var init = function () {
      console.log('hello from: login.init');
      form = document.querySelector('#mod-login');
      $(form).submit(function (e) {
        console.log('testing submit');
        console.log(e);
      })
    }

    return {
      init: init
    };
})();
