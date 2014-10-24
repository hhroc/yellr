'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.inbox = function () {


    // load messages json
    $.getJSON(args.data_url, function (data) {
      raw_data = data.messages;
      self.render();
    });


    var html = template({messages: raw_data});

    $(unread_target).html(html);
    $(read_target).html(html);

    // check for new messages
    // (alert user of this action)
   yellr.server.get_messages(function () {

      // var filtered_messages = yellr.messages.filter_messages();

      // // render messages
      // yellr.utils.render_template({
      //   template: '#inbox-li',
      //   target: '#unread-mail-list',
      //   context: {messages: filtered_messages.unread}
      // });

      // yellr.utils.render_template({
      //   template: '#inbox-li',
      //   target: '#read-mail-list',
      //   context: {messages: filtered_messages.read}
      // });
    });





    // view a message
    document.querySelector('#inbox').onclick = function view_message(e) {

      // read the data-id attribute of the right node
      var message_id = (e.target.nodeName === 'LI') ? e.target.getAttribute('data-id') : e.target.parentNode.getAttribute('data-id'),
          message = yellr.DATA.messages.filter(function (val, i, arr) {
            if (val.message_id === parseInt(message_id)) return true;
          })[0];

      yellr.utils.show_overlay({
        template: '#view-message-template',
        context: message
      });

    };


    // // create a new message
    // document.querySelector('#new-message-btn').onclick = function() {
    //   yellr.messages.create_new_message();
    // }



  // filter_messages: function () {

  //   /**
  //    * filter yellr.DATA.messages, returns an object
  //    *
  //    * reseults: {
  //    *   read: [array],
  //    *   unread: [array]
  //    * }
  //    */

  //   var read = [];
  //   var unread = yellr.DATA.messages.filter(function (val, i, arr) {

  //     // convert message_datetime to readable format here
  //     val.message_datetime = moment(val.message_datetime).format('MMM Do, h:mm a');

  //     if (parseInt(val.was_read) === 0) return true;
  //     else read.push(arr[i]);
  //   });

  //   return {
  //     read: read,
  //     unread: unread
  //   };

  // }

}
