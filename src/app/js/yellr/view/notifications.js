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
      footer = data.template.footer;


      render_template(header);
      render_template(footer);
      yellr.utils.no_subnav();
    }



    return {
      render: render
    }
})();
