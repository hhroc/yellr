'use strict';
var mod = mod || {};

mod.latest_posts = (function() {

    /**
     * This object renders the Posts feed
     * ie all the posts that users have submitted
     */


    var init = function () {


      // make sure we have data
      if (mod.DATA.posts === undefined) {
        console.log('show loading gif. tell them we\'re loading data');
        mod.data.load_posts();
      }
      else this.render();

    }



    var render = function () {
      console.log('hello from: render');

      mod.utils.render_template({
        template: '#latest-posts-template',
        target: '#latest-posts',
        context: {
          posts: mod.DATA.posts
        }
      });

    }



    return {
      init: init,
      render: render
    }
})();
