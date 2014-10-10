'use strict';
var mod = mod || {};

mod.posts = {

  get_posts: function get_posts(options) {
    $.getJSON(mod.URLS.get_posts, function get_posts_callback(response) {
      if (response.success) {
        mod.DATA.posts = mod.utils.convert_object_to_array(response.posts).reverse();
        mod.utils.save();
      } else {
        mod.utils.notify('Something went wrong loading posts.');
      }

    }).done(function () {
      if (options.callback) options.callback();
    }).fail(function () {
      mod.utils.redirect_to_login();
    });
  }

};
