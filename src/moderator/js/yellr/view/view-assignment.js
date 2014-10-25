'use strict';
var yellr =  yellr || {};
    yellr.view = yellr.view || {};

yellr.view.view_assignment = function () {

  var assignment_id = parseInt(window.location.hash.split('#')[1]);

  if (assignment_id !== NaN) {
    // render the question text and things
    var assignment = yellr.DATA.assignments.filter(function (val, i, arr) {
      if (val.assignment_id === assignment_id) return true;
    })[0];

    // render the Handlebars template
    yellr.utils.render_template({
      template: '#assignment-overview-template',
      target: '#view-assignment-section',
      context: {assignment: assignment}
    });




    // get replies to question
    yellr.server.get_responses_for(assignment_id, function (posts) {
      var replies = yellr.utils.convert_object_to_array(posts);

      yellr.utils.render_template({
        template: '#assignment-response-li-template',
        target: '#assignment-replies-list',
        context: {replies: replies}
      });

      // parse UTC dates with moment.js
      var deadline = document.querySelector('.assignment-deadline');
          deadline.innerHTML = moment(deadline.innerHTML).format('MMMM Do YYYY');
      var published = document.querySelector('.assignment-published');
          published.innerHTML = moment(published.innerHTML).format('MMMM Do YYYY');
    });

    // get assignment collection
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
