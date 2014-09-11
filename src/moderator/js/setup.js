'use strict';
var mod = mod || {};

// this contains very specific DOM refernces based on each page
// the rest of the JS files try to remain as agnostic as possible

mod.setup = {

  login: function () {

    var $form = $('#mod-login');

    $form.submit(function (e) {
      e.preventDefault();
      var fields = $form.serializeArray();

      mod.utils.login(fields[0].value, fields[1].value);
    });
  },


  assignments_page: function () {
    console.log('hello from: setup.assignments_page');
  },

  assignment_overview: function () {

    var assignment_id = parseInt(window.location.hash.split('#')[1]);

    if (assignment_id !== NaN) {
      // render the question text and things
      mod.assignments.view(assignment_id);

      // get replies to question
    }


  },


  collections_page: function () {
    // setup collections page
    // hook up the buttons
    document.querySelector('#new-collection-btn').onclick = function (e) {

      mod.utils.show_overlay({template: '#collections-form-template'});
      mod.collections.setup_form();

    }
    document.querySelector('#delete-collection-btn').onclick = function (e) {
      console.log('delete collection');
    }

    mod.collections.view_all();

  },


  inbox: function () {
    // // setup inbox
    // mod.messages.init({
    //   data_url: mod.URLS.messages,
    //   template: '#inbox-li',
    //   container: '#inbox',
    //   read_target: '#read-mail-list',
    //   unread_target: '#unread-mail-list'
    // });

    // hook up the button
    document.querySelector('#new-message-btn').onclick = function() {
      mod.messages.create_message();
    }
  },


  dashboard: function () {

    /**
     * setup the Yellr Admin dashboard
     * index.html
     */

    // load new data
    mod.utils.load({
      data: 'get_posts',
      saveAs: 'posts',
      callback: mod.feed.render_latest_posts
    });

    mod.assignments.get_my_assignments(mod.assignments.render_active);


    // - send a message to a user who submitted content
    // - add post to a collection
    // - flag inappropriate content
    document.querySelector('.submissions-grid').onclick = function(e) {
      switch (e.target.className) {
        case 'fa fa-folder':
          mod.feed.toggle_collections_dropdown(e.target);
          break;
        case 'fa fa-comment':
          var uid = e.target.offsetParent.querySelector('.meta-div').getAttribute('data-uid')
          mod.messages.create_message(uid, 'RE: Recent post on Yellr');
          break;
        case 'fa fa-flag':
          console.log('report the motherfucker');
          break;
        default:
          break;
      }
    };


    // refresh the feed
    $('#refresh-posts').on('click', function (e) {
      mod.utils.load({
        data: 'get_posts',
        saveAs: 'posts',
        callback: mod.feed.render_latest_posts
      });
    });


  },
}
