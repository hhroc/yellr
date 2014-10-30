'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

// index.html

yellr.view.index = {

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

  timeout: undefined,
  pckry: undefined,
  current_class: 'feed-gi',

  change_grid_classes_to: function (class_name) {
    // change li class to 'gi'
    var grid_items = document.querySelectorAll('.'+yellr.view.index.current_class);
    for (var i = 0; i < grid_items.length; i++) {
      grid_items[i].className = class_name;
    };

    // change current_class
    yellr.view.index.current_class = 'gi';

  },


  init: function () {
    var grid = document.querySelector('#raw-feed'),
        latest_4_assignments = [];


    // get my assignments
    // ----------------------------
    // ----------------------------
    yellr.server.get_my_assignments(function (assignments) {
      // get 4 latest
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

    });


    // get latest posts
    // setup the grid
    // ----------------------------
    yellr.server.get_posts(function () {
      var posts = yellr.DATA.posts.reverse();

      for (var i = 0; i < posts.length; i++) {
        posts[i].class = yellr.view.index.current_class;
      };

      yellr.utils.render_template({
        template: '#raw-feed-item',
        target: '#raw-feed',
        context: {posts: posts},
        prepend: true
      });

      setTimeout(function () {
        // setup packery
        yellr.view.index.pckry = new Packery(grid, {
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

      if (event.target.checked) {

        // what are we doing?
        if (event.target.value === 'list') {
          yellr.view.index.change_grid_classes_to('gi');

          // destroy pakcry
          yellr.view.index.pckry.destroy();
        } else {
          yellr.view.index.change_grid_classes_to('feed-gi');

          // redo packry
          yellr.view.index.pckry = new Packery(grid, {
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
      if (event.target.checked === true) yellr.AUTO_REFRESH = true;
      else yellr.AUTO_REFRESH = false;
      // do the
      yellr.view.index.refresh();
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

    // refresh posts every 10 seconds
    if (yellr.AUTO_REFRESH) this.refresh();
  },

  refresh: function (timeout) {
    if (yellr.AUTO_REFRESH) {

      yellr.view.index.timeout = setTimeout(function () {
        // TODO
        // update the "Last updated thing"
        yellr.server.get_posts(function () {

          var current_posts = document.querySelectorAll('.'+yellr.view.index.current_class).length,
              new_posts = [],
              new_items = [];

          if (yellr.DATA.posts.length > current_posts) {
            for (var i = current_posts; i < yellr.DATA.posts.length; i++) {
              new_posts.push(yellr.DATA.posts[i].class = yellr.view.index.current_class);
            };

            // render the latest ones
            yellr.utils.render_template({
              template: '#raw-feed-item',
              target: '#raw-feed',
              context: {posts: new_posts},
              prepend: true
            });

            // redo packery
            setTimeout(function () {
              yellr.view.index.pckry.reloadItems();
              yellr.view.index.pckry.layout();
            }, 1000);
          }

        });

        // loop
        yellr.view.index.refresh(timeout);
      }, 3000);
      // }, 10000);
    } else {
      window.clearTimeout(yellr.view.index.timeout);
      return;
    }
  }

};
