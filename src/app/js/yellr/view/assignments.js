'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.assignments = (function() {

    /**
     * latest assignments for Yellr community
     * view single assignment details
     */



    var render_template = yellr.utils.render_template;
    var header, footer;



    var render = function(data) {

      /**
       * get the hash (single or feed view?)
       */


      header = data.template.header;
      footer = data.template.footer;

      if (data.hash === '#view-assignment')
        this.render_assignment(data.id);
      else this.render_feed();

      render_template(header);
      render_template(footer);

    }









    var render_feed = function() {

      // template settings
      header.template = '#main-header';
      footer.template = '#report-bar';
      // subnav
      render_template({
        target: '#app-subnav',
        template: '#homepage-subnav'
      });
      document.querySelector('#assignments-tab').className = 'current';


      // make sure we have data
      if (yellr.DATA.assignments === undefined) {
        wait_for_data(yellr.view.assignments.render_feed, yellr.data.load_assignments);
        return;
      }

      // render the content
      var latest_assignments = render_template({
        template: '#assignments-li',
        context: {assignments: yellr.DATA.assignments }
      });
      console.log(yellr.DATA.assignments);
      console.log(latest_assignments);
      $('#latest-assignments').prepend(latest_assignments);

      // parse UTC dates with moment.js
      var dates = document.querySelectorAll('.assignment-deadline');
      for (var i = 0; i < dates.length; i++) {
        dates[i].innerHTML = moment(dates[i].innerHTML).fromNow(true)
      };

    }










    var render_assignment = function(id) {

      // template settings
      header.template = '#page-header';
      header.context = {page: 'Assignment'};
      yellr.utils.no_subnav();
      footer.template = '';


      // render the assignment
      var assignment = {
        template: '#assignment-view',
        target: '#view-assignment .assignment-view'
      }

      // find the right one first
      for (var i = 0; i < yellr.DATA.assignments.length; i++) {

        // careful, the 'id' var came fromt a string split
        if (yellr.DATA.assignments[i].id === parseInt(id)) {

          assignment.context = {
            title: yellr.DATA.assignments[i].title,
            image: yellr.DATA.assignments[i].image,
            description: yellr.DATA.assignments[i].description,
            deadline: moment(yellr.DATA.assignments[i].deadline).fromNow(true)
          }

          break;
        }
      }

      // render the page
      render_template(assignment);

    }













    var wait_time = 0;

    var wait_for_data = function(callback, reload) {

      setTimeout(callback, 1000);
      wait_time++;
      console.log('... ' + wait_time);
      if (wait_time > 5 && wait_time < 15) {
        // we've been waiting for 5 seconds, give user feedback
        console.log('... looks like we\'re still waiting on assignments to load');
      } else if (wait_time > 15) {
        // check internet connection
        // ask if user wants to try again
        // if yes reset wait_time to 0
        // call yellr.data.load_assignments
        wait_time = 0;
        reload();
      };

    }



    return {
      render: render,
      render_feed: render_feed,
      render_assignment: render_assignment,
      wait_for_data: wait_for_data
    }
})();
