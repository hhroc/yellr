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
      yellr.utils.setup_report_bar();

    }





    var render_feed = function() {
      header.template = '#main-header';
      // subnav
      render_template({
        target: '#app-subnav',
        template: '#homepage-subnav'
      });
      document.querySelector('#news-feed-tab').className = 'current';


      // render the content
      var latest_news_feed = render_template({
        template: '#news-feed-li',
        context: {news_feed: yellr.DATA.news_feed }
      });
      $('#latest-stories').html(latest_news_feed);

      // $('#latest-stories').prepend(latest_news_feed);

    }





    var read_story = function(id) {
      header.template = '#page-header';
      header.context = {page: 'Story Title', hash: '#news-feed'};
      yellr.utils.no_subnav();

      var story = {
        template: '#news-story-template',
        target: '#story-container'
      };

      for (var i = 0; i < yellr.DATA.news_feed.length; i++) {
        if (yellr.DATA.news_feed[i].id === parseInt(id)) {

          story.context = {
            title: yellr.DATA.news_feed[i].title,
            full_text: yellr.DATA.news_feed[i].full_text
          }

          if (yellr.DATA.news_feed[i].image) {
            story.context.image = yellr.DATA.news_feed[i].image;
            story.context.image_caption = yellr.DATA.news_feed[i].image_caption;
          }

          break;
        }
      }

      render_template(story);

    }





    return {
      read_story: read_story,
      render: render,
      render_feed: render_feed
    }
})();
