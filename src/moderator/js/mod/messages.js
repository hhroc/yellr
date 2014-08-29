'use strict';
var mod = mod || {};

mod.messages = (function () {

    // raw_data, read, and unread as JSON objects
    var template,
        raw_data,
        container,
        read_target,
        unread_target,
        self;

    var init = function (args) {
      self = this;
      template = Handlebars.compile($(args.template).html());
      container = args.container;
      read_target = args.read_target;
      unread_target = args.unread_target;


      // load messages json
      $.getJSON(args.data_url, function (data) {
        raw_data = data.messages;
        self.render();
      });

      // add event listner to show single email
      document.querySelector(container).onclick = self.view_message;
    }


    var render = function () {

      // FIXME
      // the raw data should be parsed
      // there should be objects to hold data for:
      // READ and UNREAD data

      var html = template({messages: raw_data});

      $(unread_target).html(html);
      $(read_target).html(html);
    }



    var view_message = function (e) {
      var message_id = (e.target.nodeName === 'LI') ? e.target.getAttribute('data-id') : e.target.parentNode.getAttribute('data-id'),
          message;

      console.log(message_id);
      for (var i = 0; i < raw_data.length; i++) {
        message = raw_data[i];
        break;
      };

      console.log(message);
      mod.utils.show_overlay({
        template: '#view-message-template',
        context: message
      });
    }



    var create_message = function (uid) {
      console.log('create message');

      mod.utils.show_overlay({
        template: '#send-message-template',
        context: {
          uid: uid
        }
      });

      $('#send-message-form .submit-btn').on('click', function (e) {
        e.preventDefault();

        console.log('send message..');
        console.log($('#send-message-form').serialize());
        $.ajax({
          type: 'POST',
          url: 'http://127.0.0.1:8080/admin/create_message.json?token='+mod.TOKEN,
          // url: 'http://yellrdev.wxxi.org/admin/create_message.json?token='+mod.TOKEN,
          dataType: 'json',
          data: $('#send-message-form').serialize(),
          success: function (data) {
            console.log(data);
            mod.utils.clear_overlay();
          }
        })
      })

    }



    return {
      init: init,
      render: render,
      view_message: view_message,
      create_message: create_message
    }
})();
