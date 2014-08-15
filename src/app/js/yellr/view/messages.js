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
      console.log('read message: ' + id);
      for (var i = 0; i < yellr.DATA.messages.length; i++) {
        if (yellr.DATA.messages[i].id === id) {
          var msg = yellr.DATA.messages[i];
          console.log(msg);
          render_template ({
            template: '#message-template',
            target: '#message-container',
            context: msg
          });
          break;
        }
      };
    }


    var message_li_handler = function (e) {

      var id = (e.target.nodeName === 'LI') ? e.target.getAttribute('data-id') : e.target.parentNode.getAttribute('data-id');
      if (id) {
        this.view_message(id);
        document.querySelector('#messages-list').removeEventListener('click', message_li_handler);
      }

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


      // add event listener to render single message
      document.querySelector('#messages-list').onclick = this.message_li_handler;
//
    }



    return {
      inbox: inbox,
      render: render,
      message_li_handler: message_li_handler,
      view_message: view_message
    }
})();
