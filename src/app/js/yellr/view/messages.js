'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.messages = (function() {

    /**
     * the user messages page for yellr
     */

    var render_template = yellr.utils.render_template;
    var header, footer, current_msg;



    var render = function(data) {

      /**
       * get the hash (single or feed view?)
       */


      header = data.template.header;
      footer = data.template.footer;
      footer.template = '';

      yellr.utils.no_subnav();


      if (data.hash === '#view-message') this.view_message(data.id);
      else if (data.hash === '#reply-message') this.reply_message();
      else this.inbox();


      // parse UTC dates with moment.js
      var dates = document.querySelectorAll('.message-meta');
      for (var i = 0; i < dates.length; i++) {
        dates[i].innerHTML = moment(dates[i].innerHTML).format("dddd, MMMM Do, h:mm a")
      };

      // leave these here..
      render_template(header);
      render_template(footer);

    }



    var inbox = function() {

      // TODO:
      // make two lists
      // unread and read
      header.template = '#page-header';
      header.context = {
        page: yellr.SCRIPT.messages,
        refresh: true
      };

      footer.template = '#messages-footer';

      render_template({
        template: '#messages-li',
        target: '#messages-list',
        context: {messages: yellr.DATA.messages}
      });


    }



    var view_message = function(id) {

      header.template = '#page-header';
      header.context = {
        page: yellr.SCRIPT.view_message,
        hash: '#messages'
      };

      current_msg = yellr.DATA.messages[parseInt(id)];

      render_template ({
        template: '#view-message-template',
        target: '#message-wrapper',
        context: current_msg
      });

    }



    var reply_message = function () {

      header.template = '#submit-header';
      render_template(header);

      render_template ({
        template: '#reply-message-template',
        target: '#reply-message-wrapper',
        context: {
          client_id: yellr.UUID,
          og_msg: current_msg
        }
      });

      // TODO - reply

    }



    var send_reply = function (e) {
      e.preventDefault();
      var $form = $('#reply-message-form');
      var url = 'http://yellrdev.wxxi.org';
      // TODO - finish
    }


    return {
      inbox: inbox,
      render: render,
      reply_message: reply_message,
      view_message: view_message,
      send_reply: send_reply
    }
})();
