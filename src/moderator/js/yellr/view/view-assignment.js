'use strict';
var yellr =  yellr || {};
    yellr.view = yellr.view || {};

yellr.view.view_assignment = function () {

  // 1.   render text
  // 2.   get assignment-responses
  // 3.   show current collection

  // get the URL hash
  // --> that is our assignment_id
  var assignment_id = parseInt(window.location.hash.split('#')[1]);

  // make sure it's a valid number
  if (assignment_id !== NaN) {

    // 1.
    // render the question text and things
    // ===================================
    var assignment = yellr.DATA.assignments.filter(function (val, i, arr) {
      if (val.assignment_id === assignment_id) return true;
    })[0];

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
    // get assignent-responses
    // ===================================
    yellr.server.get_responses_for(assignment_id, function (posts) {
      var replies = yellr.utils.convert_object_to_array(posts);
      console.log(replies);
      // yellr.utils.render_template({
      //   template: '#assignment-response-li-template',
      //   target: '#assignment-replies-list',
      //   context: {replies: replies}
      // });

    });



    // 2.
    // get assignment collection
    // ===================================
    yellr.server.get_collection(assignment_id, function (response) {
      yellr.utils.render_template({
        template: '#collections-li-template',
        target: '#assignment-collection-list',
        context: {
          collection: response.collection
        }
      })
    });


    // set the collection_id attribute to the #assignment-collections-list
    document.querySelector('#assignment-collection-list').setAttribute('data-collection-id', assignment_id);

  }

}
