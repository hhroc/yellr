'use strict';
var mod = mod || {};

mod.collections = (function() {


  var get_collection = function (collectionID, render_settings) {

    $.getJSON(mod.URLS.get_collection_posts, {
      collection_id: collectionID
    }, function (response) {

      if (response.success) {

        var posts = [];
        for (var key in response.posts) {
          posts.push(response.posts[key]);
        }

        // render the HTML to the list
        mod.utils.render_template({
          template: (render_settings.template) ? render_settings.template : '#collections-li-template',
          target: (render_settings.target) ? render_settings.target : '#assignment-collection-list',
          context: {posts: posts}
        });

      } else {
        console.log('something went wrong loading collection posts');
      }
    });
  }



  var get_my_collections = function (callback) {

    $.getJSON(mod.URLS.get_my_collections, function (response) {
      if (response.success) {
        // save our collections
        mod.DATA.collections = response.collections;
        mod.utils.save();
      } else {
        console.log('something went wrong getting your collections');
      }
    }).done(function () {
      if (callback) callback();
    });

  }


  var add_post_to_collection = function (postID, collectionID) {

    $.post(mod.URLS.add_post_to_collection, {
        post_id: postID,
        collection_id: collectionID
      }, function (response) {
        if (response.success) {
          console.log('added post to collection');
        } else {
          console.log('something went wrong adding the post to the collection');
        }
      }
    );

  }



  var view_all = function () {
    console.log('hello from: view_all');

  }




  var init = function () {
    console.log('hello from: collections.init');
  }


  var view = function () {
    console.log('hello from: collections.view');
  }


  var setup_form = function () {
    console.log('hello from: setup_form');
    // $('#new-collections-form').submit(function (e) {
    //   e.preventDefault();
    //   console.log('hello from: submit');
    //   mod.collections.submit_form();
    // });

    $('#new-collections-form').find('.submit-btn').on('click', function () {
      console.log('submit the form');
      mod.collections.submit_form();
    })
  }


  var submit_form = function () {
    console.log('hello from: submit_form');
    console.log('url: ' + mod.URLS.create_collection);

    $.ajax({
      url: mod.URLS.create_collection,
      type: 'POST',
      dataType: 'json',
      data: $('#new-collections-form').serialize(),
      success: function (response) {
        if (response.success) {
          console.log('SUCCESS');
          console.log(response);
          mod.utils.clear_overlay();
        } else {
          console.log('something went wrong');
        }
      }
    })
  }



  return {
    init: init,
    view: view,
    view_all: view_all,
    setup_form: setup_form,
    submit_form: submit_form,
    add_post_to_collection: add_post_to_collection,
    get_my_collections: get_my_collections,
    get_collection: get_collection
  }
})();
