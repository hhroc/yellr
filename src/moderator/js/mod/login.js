'use strict';
var mod = mod || {};

mod.login = (function() {

    var init = function () {

      var $form = $('#mod-login');

      $form.submit(function (e) {
        e.preventDefault();
        var fields = $form.serializeArray(),
            username = fields[0].value,
            password = fields[1].value;

        // $form
        var url = 'http://yellrdev.wxxi.org/admin/get_access_token.json?user_name='+username+'&password='+password;
        $.ajax({
          type: 'POST',
          url: url,
          success: function (data) {
            if (data.success) {
              mod.TOKEN = data.token;
              mod.utils.save();
              window.location.href = 'http://127.0.0.1:8000/moderator/latest-posts.html';
            } else {
              document.querySelector('#login-feedback').innerHTML = data.error_text;
            }
          },
          dataType: 'json'
        });
      });

    }

    return {
      init: init
    };

})();
