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
      yellr.utils.no_subnav();
      footer = data.template.footer;

      header.template = '#page-header';
      header.context = {page: 'Messages'};
      footer.template = '#messages-footer';



      if (data.hash === '#view-message')
        this.view_message(data.id);
      else this.inbox();



      // leave these here..
      render_template(header);
      render_template(footer);

    }





    var view_message = function(id) {

      header.template = '#page-header';
      header.context = {page: 'View Message', hash: '#messages'};

      render_template ({
        template: '#view-message-template',
        target: '#message-wrapper',
        context: yellr.DATA.messages[parseInt(id)]
      });

    }



    var inbox = function() {

      // TODO:
      // make two lists
      // unread and read

      render_template({
        template: '#messages-li',
        target: '#messages-list',
        context: {messages: yellr.DATA.messages}
      });


    }



    return {
      inbox: inbox,
      render: render,
      view_message: view_message
    }
})();
