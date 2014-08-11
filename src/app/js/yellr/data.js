'use strict';
var yellr = yellr || {};

yellr.data = (function() {

    var dev_urls = {
      assignments: 'data/assignments.json',
      notifications: 'data/notifications.json',
      messages: 'data/messages.json',
      news_feed: 'data/news-feed.json',
      profile: 'data/profile.json'
    };

    var live_urls = {
      assignments: 'http://yellrdev.wxxi.org/get_assignments.json',
      notifications: 'http://yellrdev.wxxi.org/get_notifications.json?client_id=',
      messages: 'http://yellrdev.wxxi.org/get_messages.json?client_id=',
      news_feed: '',
      profile: ''
    }

    var urls = {};



    var init = function() {

      // grab the data already stored
      // DATA = yellr.DATA;

      urls = dev_urls;
      // urls = live_urls;

      // load all of the things
      this.load_assignments();
      this.load_messages();
      this.load_news_feed();
      this.load_notifications();
      this.load_profile();

    }





    var load_assignments = function(callback) {

      console.log('... loading assignments');

      // load assignments
      $.getJSON(urls.assignments, function(data) {
        yellr.DATA.assignments = data.assignments;
        // console.log('... loading assignments | DONE');
        yellr.utils.save();

        if (callback) callback();
      });
    }





    var load_messages = function(callback) {

      console.log('... loading messages');

      // load messages
      $.getJSON(urls.messages, function(data) {
        yellr.DATA.messages = data.messages;
        // console.log('... loading messages | DONE');
        yellr.utils.save();

        if (callback) callback();
      });

    }






    var load_notifications = function(callback) {

      console.log('... loading notifications');

      // load notifications
      $.getJSON(urls.notifications, function(data) {
        yellr.DATA.notifications = data.notifications;
        // console.log('... loading notifications | DONE');
        yellr.utils.save();

        if (callback) callback();
      });

    }






    var load_news_feed = function(callback) {

      console.log('... loading news_feed');

      // load news_feed
      $.getJSON(urls.news_feed, function(data) {
        yellr.DATA.news_feed = data.news;
        // console.log('... loading news_feed | DONE');
        yellr.utils.save();

        if (callback) callback();
      });

    }





    var load_profile = function(uuid, callback) {

      console.log('... loading profile');

      // load profile
      var url = (uuid) ? urls.profile+uuid : urls.profile;

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
      load_messages: load_messages,
      load_notifications: load_notifications,
      load_news_feed: load_news_feed,
      load_profile: load_profile
    }
})();
