'use strict';
var mod = mod || {};

mod.data = (function() {

    var urls = {};


    var init = function() {

      if (mod.DATA === undefined) mod.DATA = {};

      urls = {
        // posts: 'http://yellrdev.wxxi.org/admin/get_posts.json?token='+mod.TOKEN
        posts: 'http://127.0.0.1:8080/admin/get_posts.json?token='+mod.TOKEN
      }

      // load all of the things
      // this.load_posts();
      // this.load_messages();
      // this.load_news_feed();
      // this.load_notifications();
      // this.load_profile();

    }





    var load_posts = function(callback) {

      console.log('... loading posts');

      $.ajax({
        type: 'POST',
        url: urls.posts,
        dataType: 'json',
        success: function (data) {

          mod.DATA.posts = data.posts;
          mod.utils.save();

          if (mod.PAGE === 'posts') mod.latest_posts.init();
          if (callback) callback();
        }
      });

    }





    var load_messages = function(callback) {

      console.log('... loading messages');

      // load messages
      $.getJSON(urls.messages, function(data) {

        // make a short message preview
        for (var i = 0; i < data.messages.length; i++) {
          data.messages[i].message_preview = data.messages[i].text.slice(0, 36).concat('...');
        };

        yellr.DATA.messages = data.messages;
        yellr.utils.save();

        if (callback) callback();
      });

    }









    return {
      init: init,
      load_posts: load_posts,
      load_messages: load_messages
    }
})();
