'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.messages = (function() {

    /**
     * the user messages page for yellr
     */

    var render_template = yellr.utils.render_template;
    var header, footer;



    var render = function(data) {

      /**
       * get the hash (single or feed view?)
       */


      header = data.template.header;
      footer = data.template.footer;

      if (data.hash === '#view-message')
        this.view_message(data.id);
      else this.inbox();

      render_template(header);
      render_template(footer);

    }





    var view_message = function(id) {
      console.log('read message: ' + id);
    }




    var inbox = function() {
      console.log('inbox');
      header.template = '#page-header';
      header.context = {page: 'Messages'};
      footer.template = '#messages-footer';
    }





    return {
      inbox: inbox,
      render: render,
      view_message: view_message
    }
})();
