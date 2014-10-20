'use strict';
var yellr = yellr || {};

// This holds all the server calls for the Moderator side
// ===================================

yellr.server = {
  get_posts: function (callback) {
    // get the latest Yellr posts
    console.log('hello from: ');
  },



  // get the user's assignments
  // ----------------------------
  get_my_assignments = function (callback) {

    var assignments;

    $.getJSON(mod.URLS.get_my_assignments, function (response) {
      if (response.success) {

        assignments = mod.DATA.assignments = mod.utils.convert_object_to_array(response.assignments);
        mod.utils.save();

      } else {
        console.log('something went wrong loading get_my_assignments');
      }
    }).done(function () {
      if (callback) callback(assignments);
    }).fail(function () {
      mod.utils.redirect_to_login();
    });

  },



  get_responses_for: function (assignment_id, callback) {

    // get our assignment responses
    var success = false,
        posts;

    // get assignment responses
    $.ajax({
      url: mod.URLS.get_assignment_responses+'&assignment_id='+assignment_id.toString(),
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
      mod.utils.redirect_to_login();
    });

  }


}
