'use strict';
var yellr = yellr || {};

// This holds all the server calls for the Moderator side
// ===================================

yellr.server = {

  // get the latest Yellr posts
  // ----------------------------
  get_posts: function (callback) {

    var success = false,
        posts = [];

    $.getJSON(yellr.URLS.get_posts, function (response) {
      if (response.success) {
        success = true;
        posts = yellr.utils.convert_object_to_array(response.posts);
        yellr.DATA.posts = posts;
        yellr.utils.save();
      } else {
        yellr.utils.notify('Something went wrong loading posts.');
      }

    }).done(function () {
      if (success) callback(posts);
    }).fail(function () {
      yellr.utils.redirect_to_login();
    });

  },



  // get the user's assignments
  // ----------------------------
  get_my_assignments: function (callback) {

    var success = false,
        assignments;

    $.getJSON(yellr.URLS.get_my_assignments, function (response) {
      if (response.success) {
        success = true;
        assignments = yellr.utils.convert_object_to_array(response.assignments);
        yellr.DATA.assignments = assignments;
        yellr.utils.save();
      } else {
        console.log('something went wrong loading get_my_assignments');
      }
    }).done(function () {
      if (success) callback(assignments);
    }).fail(function () {
      yellr.utils.redirect_to_login();
    });

  },



  get_responses_for: function (assignment_id, callback) {

    // get our assignment responses
    var success = false,
        posts;

    // get assignment responses
    $.ajax({
      url: yellr.URLS.get_assignment_responses+'&assignment_id='+assignment_id.toString(),
      type: 'POST',
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          success = true;
          posts = response.posts;
        }
      }
    }).done(function () {
        if (success) callback(posts);
    }).fail(function () {
      yellr.utils.redirect_to_login();
    });

  },


  get_collection: function (collectionID, callback) {
  // get_collection: function (collectionID, render_settings) {

    /**
     * get_collection - for Assignments overview page
     * make API post to server, get a collection back (array of posts)
     * (for now) we always render
     */

    var collection_name = '',
        collection = [],
        result = false;

    $.getJSON(mod.URLS.get_collection_posts, {
      collection_id: collectionID
    }, function (response) {

      // set return values
      if (response.success) {
        result = true;
        collection = mod.utils.convert_object_to_array(response.posts);
        collection_name = response.collection_name;
      }

    }).done(function () {

      if (result) {
        // execute callback
        if (callback) callback({
          collection: collection,
          collection_name: collection_name
        });
      } else {
        console.log('something went wrong loading collection posts');
      }

    }).fail(function () {
      mod.utils.redirect_to_login();
    });
  },



  get_my_collections: function (callback) {

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



  get_messages: function (callback) {

    /**
     * by default this function will make an API call,
     * and save messages to localStorage
     *
     * options: {
     *   callback: function() {console.log('will be called in .done()')},
     *   feedback: boolean [2do]
     *   feedbackText: 'optional string to send to mod.utils.notify()' [2do]
     * }
     */

    $.getJSON(mod.URLS.get_my_messages, function (response) {

      // save messages to localStorage
      if (response.success) mod.DATA.messages = response.messages;
      else mod.utils.notify('Could not load new messages.');

    }).done(function () {
      // do the callbacks
      if (callback) callback();
    }).fail(function () {
      mod.utils.redirect_to_login();
    });

  },



  send_message: function (subject, text, to, callback, parent_message_id) {

    var data = {
      subject: subject,
      text: text,
      to_client_id: to,
    }
    if (parent_message_id) data.parent_message_id = parent_message_id;

    $.ajax({
      type: 'POST',
      url: mod.URLS.create_message,
      dataType: 'json',
      data: data,
      success: function (response) {
        if (response.success) {
          mod.utils.notify('Message sent!');
        } else {
          mod.utils.notify('Error sending message. Check the user ID.');
        }
      }
    }).done(function () {
      if (callback) callback();
    });


  }



}
