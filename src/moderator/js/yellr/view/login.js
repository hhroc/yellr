'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

// index.html

yellr.view.login = function () {

  document.querySelector('#mod-login').onsubmit = function (event) {

    event.preventDefault();

    // login (username, passwod, error feedback)
    // login automatically goes to index.html
    yellr.server.login(this.elements['user_name'].value, this.elements['password'].value, function (response) {
      // handle login errors
      if (!response.success) document.querySelector('#login-feedback').innerHTML = response.error_text;
    });
  }
}
