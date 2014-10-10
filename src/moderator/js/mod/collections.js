'use strict';
var mod = mod || {};

mod.collections = {


  get_collection: function (collectionID, render_settings) {

    /**
     * get_collection - for Assignments overview page
     * make API post to server, get a collection back (array of posts)
     * (for now) we always render
     */

     var collection = [];

    $.getJSON(mod.URLS.get_collection_posts, {
      collection_id: collectionID
    }, function (response) {

      if (response.success) {

        // the posts response is an object that we turn into an array
        // ----------------------------
        var posts = mod.utils.convert_object_to_array(response.posts);


        // render the HTML to the list
        // ----------------------------
        // ** this got a little messy **
        // no. this is completely fucked... sorry
        // it should return an aray so that you can what you want with it
        var settings = {};
        if (render_settings) {
          // we have ternary operators here to check if we passed in a setting
          // if we didn't we fall back to defaults
          settings.template = (render_settings.template) ? render_settings.template : '#collections-li-template';
          settings.target = (render_settings.target) ? render_settings.target : '#assignment-collection-list';
          settings.append = (render_settings.append) ? render_settings.append : null;
        }
        else {
          // DEFAULT SETTINGS
          settings.template = '#collections-li-template';
          settings.target = '#assignment-collection-list';
        }
        // add the context
        settings.context = {posts: posts};

        // DO IT
        mod.utils.render_template(settings);


        // how it should be...
        // ----------------------------
        collection = posts;
        console.log('return collection..', collection);
        return collection;

      } else {
        console.log('something went wrong loading collection posts');
      }
    }).fail(function () {
      mod.utils.redirect_to_login();
    });
  },



  get_my_collections: function (options) {

    $.getJSON(mod.URLS.get_my_collections, function (response) {
      if (response.success) {
        // save our collections
        mod.DATA.collections = response.collections;
        mod.utils.save();
      } else {
        console.log('something went wrong getting your collections');
      }
    }).done(function () {
      if (options.callback) options.callback();
    }).fail(function () {
      mod.utils.redirect_to_login();
    });

  },


  add_post_to_collection: function (post_id, collection_id, callback) {

    // post_id = int
    // collection_id = int
    // callback = function (boolean)
    // ----------------------------
    var result = false;

    // post to server
    $.post(mod.URLS.add_post_to_collection,
    {
      post_id: post_id,
      collection_id: collection_id
    },
    function (response) {
      if (response.success) result = true;
    }).done(function () {
      // provide feedback
      if (result) console.log('added post to collection');
      else console.log('something went wrong adding the post to the collection');

      // execute callback
      if (callback) callback(result);

    }).fail(function () {
      console.log('something went wrong adding the post to the collection');
      return result;
    });

  },


  setup_form: function () {
    console.log('hello from: setup_form');

    $('#new-collections-form').find('.submit-btn').on('click', function () {
      console.log('submit the form');
      mod.collections.submit_form();
    })
  },


  submit_form: function () {
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

};
