'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.notifications = (function() {

    /**
     * the user notifications page for yellr
     */

    var render_template = yellr.utils.render_template;
    var header, footer;



    var render = function(data) {

      /**
       * get the hash (single or feed view?)
       */


      header = data.template.header;
      header.template = '#page-header';
      header.context = {page: 'Notifications'};
      footer = data.template.footer;


      render_template(header);
      render_template(footer);
      yellr.utils.no_subnav();

      this.add_eventlisteners();
    }





    var update = function() {
      console.log('check if data is new and different');
    }



    var add_eventlisteners = function() {
      // refresh
      document.querySelector('#refresh-btn').onclick = function(e) {
        this.className = 'loading';
        console.log(this);
        yellr.data.load_notifications(this.update);
      }
    }

    return {
      add_eventlisteners: add_eventlisteners,
      render: render,
      update: update
    }
})();
