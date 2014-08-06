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
      // this.load_news_reports();
      // this.load_notifications();
      this.load_profile();

    }





    var load_assignments = function(callback) {

      // console.log('... loading assignments');

      // load assignments
      $.getJSON(urls.assignments, function(data) {
        yellr.DATA.assignments = data;
        // console.log('... loading assignments | DONE');
        yellr.utils.save();

        if (callback) callback();
      });

    }






    var load_notifications = function(callback) {

      // console.log('... loading notifications');

      // load notifications
      $.getJSON(urls.notifications, function(data) {
        yellr.DATA.notifications = data;
        // console.log('... loading notifications | DONE');
        yellr.utils.save();

        if (callback) callback();
      });

    }






    var load_news_reports = function(callback) {

      // console.log('... loading news_reports');

      // load news_reports
      $.getJSON(urls.news_reports, function(data) {
        yellr.DATA.news_reports = data;
        // console.log('... loading news_reports | DONE');
        yellr.utils.save();

        if (callback) callback();
      });

    }





    var load_profile = function(uuid, callback) {

      // console.log('... loading profile');

      // load profile
      var url = (uuid) ? urls.profile + '?client_id='+uuid : urls.profile;
      console.log('... ' + url);

      $.getJSON(url, function(data) {
        yellr.DATA.profile = data;
        // console.log('... loading profile | DONE');
        yellr.utils.save();

        if (callback) callback();
      });

    }





    return {
      init: init,
      load_assignments: load_assignments,
      load_notifications: load_notifications,
      load_news_reports: load_news_reports,
      load_profile: load_profile
    }
})();
