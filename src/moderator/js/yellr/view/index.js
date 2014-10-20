'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

// index.html

yellr.view.dashboard: function () {

    /**
     * setup the Yellr Admin dashboard
     * index.html
     *
     * - get user assignments
     * - get latest Yellr posts
     * - toggle grid/list view
     * - toggle auto-update
     * - setup feed filter
     *
     */

    var pckry,
        grid = document.querySelector('#raw-feed');


    // get my assignments
    // ----------------------------
    // ----------------------------
    yellr.server.get_my_assignments(function (assignments) {
      // get 4 latest
      var latest_4_assignments = [];
      for (var i = 0; i < assignments.length; i++) {
        latest_4_assignments.push(assignments[i]);
        if (latest_4_assignments.length >= 4) break;
      };

      // use moment.js
      latest_4_assignments.filter(function (val) {
        val.expire_datetime = moment(val.expire_datetime).fromNow(true);
      });

      // render html
     yellr.utils.render_template({
        template: '#active-assignment-template',
        target: '#active-assignments-list',
        context: {assignments: latest_4_assignments }
      });

    );


    // get latest posts
    // setup the grid
    // ----------------------------
    yellr.server.get_posts(function () {
      yellr.utils.render_template({
        template: '#raw-feed-item',
        target: '#raw-feed',
        context: {posts: yellr.DATA.posts},
        append: true
      });

      setTimeout(function () {
        // setup packery
        pckry = new Packery(grid, {
          itemSelector: '.feed-gi',
          columnWidth: '.feed-sizer',
          gutter: '.feed-gutter'
        });
      }, 1000);
    });



    // view, and filter things
    // ----------------------------
    // ----------------------------




    // toggle grid/list view
    // ----------------------------
    document.querySelector('#feed-view').onclick = function (event) {

      var view, grid_items;

      if (event.target.checked) {

        view = event.target.value;

        // what are we doing?
        if (view === 'list') {

          // change li class
          grid_items = grid.querySelectorAll('.feed-gi');
          for (var i = 0; i < grid_items.length; i++) {
            grid_items[i].className = 'gi';
          };

          // destroy pakcry
          pckry.destroy();
        } else {
          grid_items = grid.querySelectorAll('.gi');
          for (var i = 0; i < grid_items.length; i++) {
            grid_items[i].className = 'feed-gi';
          };

          // redo packry
          pckry = new Packery(grid, {
            itemSelector: '.feed-gi',
            columnWidth: '.feed-sizer',
            gutter: '.feed-gutter'
          });
        }
      } // /if input.checked
    }
    // ----------------------------



    // auto-update
    // ----------------------------
    document.querySelector('#auto-update').onclick = function (event) {
      // set auto-refresh to true
      if (event.target.checked === true) {
        AUTO_REFRESH = true;
        yellr.utils.load_latest_posts();
      } else {
        // auto-refresh = false
        AUTO_REFRESH = false;
      }
    }

    // setup the filter
    // ----------------------------
    document.querySelector('.feed-filter-div').onclick = function (event) {
      console.log('hello from: ');
    }


    // event listeners:
    // - send a message to a user who submitted content
    // - add post to a collection
    // - flag inappropriate content
    grid.onclick = function(e) {
      console.log('lol');
      switch (e.target.className) {

        // add post to a collection
        case 'fa fa-folder':
          // show a list of collections via a dropdown
          // pass in the DOM element
          yellr.feed.toggle_collections_dropdown(e.target);
          break;

        // send user a message
        case 'fa fa-comment':

          var domNode = e.target.offsetParent.querySelector('.meta-div'),
              postID = parseInt(domNode.getAttribute('data-post-id')),
              data = yellr.DATA.posts.filter(function (val, i, arr) {
                if (val.post_id === postID) return true;
              })[0];

          yellr.utils.show_overlay({
            template: '#send-message-template',
            context: {
              uid: data.client_id,
              subject: 'RE: '+data.title
            }
          });

          var $form = $('#send-message-form');
          $form.submit(function (e) {
            e.preventDefault();
            var array = $form.serializeArray();

            yellr.messages.send_message({
              to: array[0],
              subject: array[1],
              text: array[2],
              callback: function () {
                yellr.utils.clear_overlay();
              }
            });
          });

          break;
        // flag as inappropriate
        case 'fa fa-flag':
          console.log('report the motherfucker');
          break;
        default:
          break;
      }
    };


    // // refresh the feed
    // $('#refresh-posts').on('click', function (e) {

    //   // get latest posts
    //   yellr.posts.get_posts({
    //     callback: function () {
    //       yellr.utils.render_template({
    //         template: '#latest-posts-template',
    //         target: '#latest-posts',
    //         context: {posts: yellr.DATA.posts}
    //       });
    //     }
    //   });

    // });

    // refresh posts every 10 seconds
    yellr.utils.load_latest_posts();
  }
