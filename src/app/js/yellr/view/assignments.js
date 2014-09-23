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
      else {
        this.setup_feed();
      }

      render_template(header);
      render_template(footer);

      yellr.utils.setup_report_bar();

    }







    var setup_feed = function() {

      // template settings
      header.template = '#main-header';
      footer.template = '#report-bar';
      // subnav
      render_template({
        target: '#app-subnav',
        template: '#homepage-subnav',
        context: {
          assignments: yellr.SCRIPT.assignments,
          news_feed: yellr.SCRIPT.news_feed
        }
      });
      document.querySelector('#assignments-tab').className = 'current';


      // make sure we have data
      if (yellr.DATA.assignments === undefined) {
        wait_for_data(yellr.view.assignments.render_feed, yellr.utils.load('assignments'));
        return;
      } else {
        this.render_feed();
      }

    }






    var render_feed = function() {

      // loop through assignments
      // prep language / parse with moment.js
      var assignments = yellr.DATA.assignments.filter(function (val, i, arr) {
        val.view_assignment = yellr.SCRIPT.view_assignment;
        // val.expire_datetime = moment(val.expire_datetime).fromNow(true);
        return true;
      });

      // do the thing
      render_template({
        target: '#latest-assignments',
        template: '#assignments-li',
        context: {
          assignments: assignments,
          no_assignments_yet: yellr.SCRIPT.no_assignments_yet,
          check_back_later_for_assignments: yellr.SCRIPT.check_back_later_for_assignments
        }
      });

      // parse UTC dates with moment.js
      // TODO: parse when we initially download the JSON
      var dates = document.querySelectorAll('.assignment-deadline');
      for (var i = 0; i < dates.length; i++) {
        dates[i].innerHTML = moment(dates[i].innerHTML).fromNow(true)
      };

    }








    var render_assignment = function(id) {

      // parse to int
      id = parseInt(id)


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


      assignment.context = {
        id: yellr.DATA.assignments[id].assignment_id,
        title: yellr.DATA.assignments[id].question_text,
        image: yellr.DATA.assignments[id].image,
        description: (yellr.DATA.assignments[id].description) ? yellr.DATA.assignments[id].description : 'This is where a longer description would be for the assignment',
        deadline: moment(yellr.DATA.assignments[id].expire_datetime).fromNow(true)
      }

      switch (yellr.DATA.assignments[id].question_type_id) {
        case 1:
          assignment.context.free_text = true;
          break;
        case 2:
          assignment.context.survey = true;
          break;
        default:
          break;
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
      setup_feed: setup_feed,
      render_feed: render_feed,
      render_assignment: render_assignment,
      wait_for_data: wait_for_data
    }
})();
