'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.assignments = (function() {

    /**
     * latest assignments for Yellr community
     * view single assignment details
     */



    var render_template = yellr.utils.render_template;
    var hash, id;
    var header, footer;


    var render = function() {

      /**
       * get the hash (single or feed view?)
       */

      var hash_string = (window.location.hash === '') ? '#assignments' : window.location.hash;  // ex. #assignments
      hash_string = hash_string.split('/');

      // ex. #assignments/43132
      hash = hash_string[0];  // #assignments
      id   = hash_string[1];  // 43132
      // console.log(hash, id);

      if (hash === '#view-assignment') this.render_assignment();
      else this.render_feed();

      render_template(header);
      render_template(footer);

    }




    var render_feed = function() {

      // render header
      header = {
        template: '#main-header',
        target: '#app-header'
      };

      var subnav = {
        template: '#report-bar',
        target: '#query-string',
      };


      // footer
      footer = {
        template: '#report-bar',
        target: '#app-footer',
        // events: yellr.setup.report_bar
      };

      if (yellr.DATA.assignments === undefined) {
        wait_for_data(this.render_feed);
        return;
      }

      // console.log(yellr.DATA.assignments);


      // Handlebars compile into strings
      // so we'll be concatenating to this string
      // var html = '';

      // for (var i = 0; i < yellr.DATA.assignments.length; i++) {
      //   var asgmt = yellr.DATA.assignments[i];
      //   html += render_template({
      //     template: '#assignments-li',
      //     context: {
      //       id: asgmt.id,
      //       title: asgmt.title,
      //       contributions: asgmt.contributions.length,
      //       deadline: moment(asgmt.deadline).fromNow(true)
      //     }
      //   });
      // };

      // $('#latest-assignments').html(html);

      yellr.utils.render_list({
        data: yellr.DATA.assignments,
        target: '#latest-assignments',
        prepend: true
      });

    }







    var render_assignment = function() {

      header.template = '#page-header';
      header.context = {page: 'Assignment'};
      header.events = undefined;


      // find the right one first
      for (var i = 0; i < yellr.DATA.assignments.length; i++) {

        // careful, the 'id' var came fromt a string split
        if (yellr.DATA.assignments[i].id === parseInt(id)) {

          // render the page
          render_template({
            template: '#assignment-view',
            target: '#view-assignment .assignment-view',
            context: yellr.DATA.assignments[i]
          })

          return;
        }
      }
    }













    var wait_time = 0;

    var wait_for_data = function(callback) {

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
      };

    }



    return {
      render: render,
      render_feed: render_feed,
      render_assignment: render_assignment,
      wait_for_data: wait_for_data
    }
})();
