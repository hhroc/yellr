'use strict';
var yellr = yellr || {};

yellr.data = (function() {

    var urls = {
      assignments: 'data/assignments.json',
      notifications: 'data/notifications.json',
      news_reports: 'data/news-reports.json',
      profile: 'data/profile.json'
    };

    // 'private' reference to localStorage
    // var DATA = {};



    var init = function() {

      // grab the data already stored
      // DATA = yellr.DATA;



      // load all of the things
      this.load_assignments();
      // this.load_notifications();
      // this.load_news_reports();
      // this.load_profile();

    }



    var save = function() {

      // localStorage.setItem('yellr', JSON.stringify(yellr.localStorage));
      // yellr.localStorage = JSON.parse(localStorage.getItem('yellr'));
      // console.log('localStorage saved.');


      // console.log('data saved');
    }





    var load_assignments = function() {

      // console.log('... loading assignments');

      // load assignments
      $.getJSON(urls.assignments, function(data) {
        yellr.DATA.assignments = data;
        console.log('... loading assignments | DONE');
        console.log(yellr);
        yellr.utils.save();
      });

    }






    var load_notifications = function() {
      // console.log('... loading notifications');
    }






    var load_news_reports = function() {
      // console.log('... loading news_reports');
    }





    var load_profile = function() {
      // console.log('... loading profile');
    }





    return {
      init: init,
      save: save,
      load_assignments: load_assignments,
      load_notifications: load_notifications,
      load_news_reports: load_news_reports,
      load_profile: load_profile
    }
})();
