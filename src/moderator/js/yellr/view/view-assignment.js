'use strict';
var yellr =  yellr || {};
    yellr.view = yellr.view || {};

yellr.view.view_assignment = (function () {


  var collection = [],
      collection_id,
      assignment = [],
      assignment_id,
      new_replies = [],
      total_posts = 0,
      auto_refresh = true,
      interval_time = 3; /*seconds*/



  var init = function (_assignment_id) {


    // 0.   (optional parameter)
    // 1.   render assignment overview header
    // 2.   get assignment-responses
    //   b  setup event listeners
    // 3.   show current collection
    // 4.   set the collection_id attribute to the #assignment-collections-list
    // ===================================



    // 0. optional
    // ===================================
    // get the URL hash
    // --> that is our assignment_id
    // if id is pased in use it, otherwise use URL hash
    assignment_id = _assignment_id ? _assignment_id : parseInt(window.location.hash.split('#')[1]);

    // make sure it's a valid number
    // ----------------------------
    if (assignment_id !== NaN) {



      // 1.
      // render the question text and things
      // ===================================
      // ===================================
      assignment = yellr.DATA.assignments.filter(function (val, i, arr) {
        if (val.assignment_id === assignment_id) return true;
      })[0];

      // TODO - set correcy collection_id
      collection_id = assignment.assignment_id;


      // render the Handlebars template
      yellr.utils.render_template({
        template: '#assignment-overview-template',
        target: '#view-assignment-section',
        context: {assignment: assignment}
      });

      // parse UTC dates with moment.js
      var deadline = document.querySelector('.assignment-deadline');
          deadline.innerHTML = moment(deadline.innerHTML).format('MMMM Do YYYY');
      var published = document.querySelector('.assignment-published');
          published.innerHTML = moment(published.innerHTML).format('MMMM Do YYYY');





      // 2.
      // get assignment collection
      // ===================================
      // ===================================
      // TODO - change asignment_id to collection_id
      yellr.server.get_collection(collection_id, function (response) {

        collection = response.collection;

        yellr.utils.render_template({
          template: '#collections-li-template',
          target: '#assignment-collection-list',
          context: {
            collection: response.collection
          }
        });


        // 3.
        // get responses
        // ===================================
        yellr.server.get_responses_for(assignment_id, function (posts) {

          var all_posts = yellr.utils.convert_object_to_array(posts);
          yellr.view.view_assignment.total_posts = all_posts.length;

          new_replies = filter_for_new_responses(all_posts);

          yellr.utils.render_template({
            template: '#assignment-response-li-template',
            target: '#assignment-replies-list',
            context: {replies: new_replies}
          });

        });

      });




      // 4
      // add event listeners
      // ----------------------------
      document.querySelector('#assignment-replies-list').onclick = function (event) {
        if (event.target.nodeName === 'I') {
          // what are we doing?
          //    add | comment | flag | trash
          var action = event.target.parentNode.getAttribute('data-action');

          switch (action) {
            case 'add':
              // get the post id from the meta-div
              var post_id = parseInt(event.target.parentNode.parentNode.parentNode.querySelector('.meta-div').getAttribute('data-post-id'));

              console.log(post_id);

              yellr.server.add_post_to_collection(post_id, collection_id, function (result) {
                if (result) {
                  yellr.utils.notify('Post added to collection');
                  // this is a quick hack
                  // should use a CSS class instead
                  var li = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
                  li.style.opacity = '0.3';
                  li.parentNode.removeChild(li);

                  // update collection
                  console.log('update collection');
                  yellr.server.get_collection(collection_id, function (response) {

                    // collection = response.collection;
                    console.log('new');
                    console.log(response.collection);
                    yellr.utils.render_template({
                      template: '#collections-li-template',
                      target: '#assignment-collection-list',
                      context: {
                        collection: response.collection
                      }
                    });
                  });

                };
              });

              break;
            case 'feedback':
              break;
            case 'flag':
              break;
            case 'remove':
              break;

            default:
              break;
          }
          console.log(event.target.parentNode.getAttribute('data-action'));

        }
      };


      document.querySelector('#auto-reload').onclick = function (event) {
        if (event.target.checked) {
          console.log('toggle reload');
          yellr.view.view_assignment.auto_refresh = true;
          yellr.view.view_assignment.loop();
        }
        else {
          yellr.view.view_assignment.auto_refresh = false;
          yellr.view.view_assignment.loop();
        }
      }


      // 4. loop
      // ===================================
      yellr.view.view_assignment.loop();

    }



  }



  var filter_for_new_responses = function (replies) {

    // filter out what is:
    //  1- already in our collection
    //  2- flagged
    //  3- trashed?

    var new_replies = [];


    // go through the replies
    for (var i = 0; i < replies.length; i++) {
      // reply
      var new_response = true,
          reply = replies[i];

      // is
      for (var j = 0; j < collection.length; j++) {

        // collection_id = collection[j].post_id;
        // console.log(collection[j].post_id);
        if (reply.post_id === collection[j].post_id) {
          new_response = false;
        }
      }

      if (new_response) new_replies.push(reply);
    };


    return new_replies;
  }







  var loop = function (timeout) {

    var timeout = timeout;

    if (yellr.view.view_assignment.auto_refresh) {
      timeout = setTimeout(function () {

        // check for new posts
        yellr.server.get_responses_for(assignment_id, function (posts) {

          var all_posts = yellr.utils.convert_object_to_array(posts);

          if (all_posts.length > yellr.view.view_assignment.total_posts) {
            console.log('new posts');
            yellr.view.view_assignment.total_posts = all_posts.length;

            new_replies = filter_for_new_responses(all_posts);

            yellr.utils.render_template({
              template: '#assignment-response-li-template',
              target: '#assignment-replies-list',
              context: {replies: new_replies}
            });

          }

        });

        // loop
        yellr.view.view_assignment.loop(timeout);
      }, interval_time * 1000);
    } else {
      window.clearTimeout(timeout);
    }

  }


  return {
    init: init,
    loop: loop,
    auto_refresh: auto_refresh,
    total_posts: total_posts,
    filter_for_new_responses: filter_for_new_responses
  }


})();
