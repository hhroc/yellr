'use strict';
var yellr = yellr || {};

// This holds all the server calls for the Moderator side
// ===================================

yellr.server = {


  // get a user admin token
  //  - admin/get_access_token.json
  // ----------------------------
  login: function (username, password, callback) {

    // SET THE URLS HERE NOW THAT WE HAVE A USERNAME AND PASSWORD
    var url = yellr.BASE_URL+'admin/get_access_token.json?user_name='+username+'&password='+password;

    // $form
    $.ajax({
      type: 'POST',
      url: url,
      dataType: 'json',
      success: function (data) {
        if (callback) callback(data);

        if (data.success) {
          yellr.TOKEN = data.token;
          yellr.utils.save();
          yellr.utils.set_urls();

          yellr.server.get_languages(function (response) {
            if (response.success) yellr.utils.redirect_to('index.html');
          });
        }
      }
    });

  },


  // get available languages
  //  - admin/get_languages.json
  // ----------------------------
  get_languages: function (callback) {

    $.ajax({
      url: yellr.URLS.get_languages,
      type: 'POST',
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          yellr.DATA.languages = response.languages;
          yellr.utils.save();
          if (callback) callback(response);
        } else {
          yellr.utils.redirect_to_login();
        }
      }
    });

  },



  // language_code
  // question_text
  // description
  // question_type
  // answers
  create_question: function (data, callback) {

    // stringify some things
    if (data.answers) data.answers = JSON.stringify(data.answers);

    // post
    $.ajax({
      type: 'POST',
      url: yellr.URLS.create_question,
      data: data,
      // data: $question_form.serialize()+'&answers='+JSON.stringify(survey_answers),
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          if (callback) callback(response);
        }
      }
    });

  },


  publish_assignment: function (data, callback) {

    // data: {
    //   'life_time': total,
    //   'questions': questions (array),
    //   'top_left_lat': 43.4,
    //   'top_left_lng': -77.9,
    //   'bottom_right_lat': 43.0,
    //   'bottom_right_lng': -77.3
    // },

    data.questions =JSON.stringify(data.questions);

    $.ajax({
      type: 'POST',
      url: yellr.URLS.publish_assignment,
      data: data,
      dataType: 'json',
      success: function (response) {
        console.log(response);
        if (response.success) {
          if (callback) callback(response);
        } else {
          alert('Something went wrong submitting an Assignment');
        }
      },
      error: function (response) {
        console.log('ERR_RRORRERIRIRIR');
        console.log(response);
      }

    });

  },




  create_collection: function (data, callback) {

    // {
    //   name: 'Assignment #'+response.assignment_id+' Collection',
    //   description: 'Collection for #'+response.assignment_id,
    //   tags: 'some, example, collection tags'
    // }

    $.ajax({
      url: yellr.URLS.create_collection,
      type: 'POST',
      dataType: 'json',
      data: data,
      success: function (response) {
        if (response.success) {
          if (callback) callback();
          // clear array
        } else console.log('something went wrong creating a collection for this assignment');
      }
    });

  },



  // get the latest Yellr posts
  // ----------------------------
  get_posts: function (callback) {

    var success = false,
        posts = [];

    $.getJSON(yellr.URLS.get_posts, function (response) {
      if (response.success) {
        success = true;
        posts = yellr.utils.convert_object_to_array(response.posts);
        // yellr.DATA.posts = posts.reverse();
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

    $.getJSON(yellr.URLS.get_collection_posts, {
      collection_id: collectionID
    }, function (response) {

      // set return values
      if (response.success) {
        // execute callback
        callback({
          collection: yellr.utils.convert_object_to_array(response.posts),
          collection_name: response.collection_name
        });
      }

    }).fail(function () {
      yellr.utils.redirect_to_login();
    });
  },



  get_my_collections: function (callback) {

    $.getJSON(yellr.URLS.get_my_collections, function (response) {
      if (response.success) {
        // save our collections
        yellr.DATA.collections = response.collections;
        yellr.utils.save();
      } else {
        console.log('something went wrong getting your collections');
      }
    }).done(function () {
      if (callback) callback();
    }).fail(function () {
      yellr.utils.redirect_to_login();
    });

  },



  add_post_to_collection: function (post_id, collection_id, callback) {

    // post_id = int
    // collection_id = int
    // callback = function (boolean)
    // ----------------------------
    var result = false;

    // post to server
    $.post(yellr.URLS.add_post_to_collection,
    {
      post_id: post_id,
      collection_id: collection_id
    },
    function (response) {
      if (response.success) {
        result = true;
        if (callback) callback(result);
      }
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
     *   feedbackText: 'optional string to send to yellr.utils.notify()' [2do]
     * }
     */

    $.getJSON(yellr.URLS.get_my_messages, function (response) {

      // save messages to localStorage
      if (response.success) yellr.DATA.messages = response.messages;
      else yellr.utils.notify('Could not load new messages.');

    }).done(function () {
      // do the callbacks
      if (callback) callback();
    }).fail(function () {
      yellr.utils.redirect_to_login();
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
      url: yellr.URLS.create_message,
      dataType: 'json',
      data: data,
      success: function (response) {
        if (response.success) {
          yellr.utils.notify('Message sent!');
          if (callback) callback(response);
        } else {
          yellr.utils.notify('Error sending message. Check the user ID.');
        }
      }
    });


  },


  publish_story: function (data, callback) {

    $.post(yellr.URLS.publish_story, data,
    function (response) {
      if (response.success) {
        if (callback) callback(response);
      } else {
        yellr.utils.notify('something went wrong');
      }
    });

  }

}
