'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

// index.html

yellr.view.login = function () {
  var $form = $('#mod-login');

  $form.submit(function (e) {
    e.preventDefault();
    var fields = $form.serializeArray();
    yellr.utils.login(fields[0].value, fields[1].value);
  });

}
