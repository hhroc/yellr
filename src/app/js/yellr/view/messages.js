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

      // setup the refresh button
      // add some delay so that #refresh-btn exists
      setTimeout(function () {
        var $refresh_btn = $('#refresh-btn');
        $refresh_btn.on('tap', function (event) {

          $refresh_btn.find('i').addClass('fa-spin');

          yellr.utils.load('messages', function () {
            // feedback
            yellr.utils.notify('Messages loaded');
            $refresh_btn.find('i').removeClass('fa-spin');

            // render messages
            render_template({
              template: '#messages-li',
              target: '#messages-list',
              context: {messages: yellr.DATA.messages}
            });
          });

        });
        // finish onTap
      }, 500);



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
      header.context = {
        submit_report: yellr.SCRIPT.reply,
        hash: '#messages'
      }
      render_template(header);

      // hook up the [Send] btn
      setTimeout(function () {
        $('#submit-btn').on('tap', function (event) {

          yellr.utils.notify('Sending message...');

          var subject = encodeURIComponent('RE: '+current_msg.subject),
              text = encodeURIComponent(document.querySelector('#reply-message-form textarea').value);

          console.log(yellr.URLS.send_message+'subject='+subject+'&text='+text+'&parent_message_id='+current_msg.message_id);

          $.post(encodeURI(yellr.URLS.send_message+'subject='+subject+'&text='+text+'&parent_message_id='+current_msg.message_id),
            function (response) {
              if (response.success) {
                yellr.utils.notify('Message sent!');
                yellr.utils.redirect('#messages');
              }
              else yellr.utils.notify(response.error_text);
            }
          );

        });
      }, 500);


      render_template ({
        template: '#reply-message-template',
        target: '#reply-message-wrapper',
        context: {
          client_id: yellr.UUID,
          og_msg: current_msg
        }
      });

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
