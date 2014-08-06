'use strict';
var yellr = yellr || {};

yellr.view.news_feed = (function() {

    var render_template = yellr.utils.render_template;
    var header, footer;



    var render = function(data) {

      /**
       * get the hash (single or feed view?)
       */


      header = data.template.header;
      footer = data.template.footer;

      if (data.hash === '#view-news')
        this.read_story(data.id);
      else this.render_feed();

      render_template(header);
      render_template(footer);

    }





    var render_feed = function() {
      header.template = '#main-header';
      // subnav
      render_template({
        target: '#app-subnav',
        template: '#homepage-subnav'
      });
      document.querySelector('#news-feed-tab').className = 'current';
      console.log('latest news');
    }





    var read_story = function(id) {
      console.log('read story: ' + id);
      header.template = '#page-header';
      header.context = {page: 'Story Title', hash: '#news-feed'};
      yellr.utils.no_subnav();
    }





    return {
      read_story: read_story,
      render: render,
      render_feed: render_feed
    }
})();
