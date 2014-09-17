'use strict';
var mod = mod || {};

mod.collections = (function() {


  var get_collection = function (collectionID, render_settings) {

    /**
     * get_collection - for Assignments overview page
     * make API post to server, get a collection back (array of posts)
     * (for now) we always render
     */


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
        var settings = {};
        if (render_settings) {
          // we have ternary operators here to check if we passed in a setting
          // if we didn't we fall back to defaults
          settings.template = (render_settings.template) ? render_settings.template : '#collections-li-template';
          settings.target = (render_settings.target) ? render_settings.target : '#assignment-collection-list';
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

      } else {
        console.log('something went wrong loading collection posts');
      }
    });
  }



  var get_my_collections = function (options) {

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
    });

  }


  var add_post_to_collection = function (postNode, collectionNode) {

    /**
     * pass in a string or DOM reference (DOM must have a data-attribute on it)
     */

    // if a DOM, get the attribute, otherwise assume they are the IDs
    var postID = (typeof postNode === 'object') ? postNode.getAttribute('data-post-id') : postNode,
        collectionID = (typeof collectionNode === 'object') ? collectionNode.getAttribute('data-collection-id') : collectionNode,
        success = false;


    $.post(mod.URLS.add_post_to_collection, {
        post_id: postID,
        collection_id: collectionID
      }, function (response) {
        if (response.success) {
          success = true;
          console.log('added post to collection');
        } else {
          console.log('something went wrong adding the post to the collection');
        }
      }
    ).done(function () {
      if (success && typeof postNode === 'object' && typeof collectionNode === 'object') {
        // do the nice visual cue where we:
        // - hide the post from the responses list
        // - add it to the Collection list
        $('#post-id-'+postID).hide();
        mod.collections.get_collection(collectionID)
      }
    });

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
    setup_form: setup_form,
    submit_form: submit_form,
    add_post_to_collection: add_post_to_collection,
    get_my_collections: get_my_collections,
    get_collection: get_collection
  }
})();
