'use strict';
var mod = mod || {};

mod.messages = {

  get_messages: function (options) {

    /**
     * by default this function will make an API call,
     * and save messages to localStorage
     *
     * options: {
     *   callback: function() {console.log('will be called in .done()')},
     *   feedback: boolean [2do]
     *   feedbackText: 'optional string to send to mod.utils.notify()' [2do]
     * }
     */

    $.getJSON(mod.URLS.get_my_messages, function (response) {

      // save messages to localStorage
      if (response.success) mod.DATA.messages = response.messages;
      else mod.utils.notify('Could not load new messages.');

    }).done(function () {
      // do the callbacks
      if (options.callback) options.callback();
    });

  },


  filter_messages: function () {

    /**
     * filter mod.DATA.messages, returns an object
     *
     * reseults: {
     *   read: [array],
     *   unread: [array]
     * }
     */

    var read = [];
    var unread = mod.DATA.messages.filter(function (val, i, arr) {

      // convert message_datetime to readable format here
      val.message_datetime = moment(val.message_datetime).format('MMM Do, h:mm a');

      if (parseInt(val.was_read) === 0) return true;
      else read.push(arr[i]);
    });

    return {
      read: read,
      unread: unread
    };

  },






















  // ===================================
  // ===================================


  init: function (args) {
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

  },


  render: function () {

    // FIXME
    // the raw data should be parsed
    // there should be objects to hold data for:
    // READ and UNREAD data

    var html = template({messages: raw_data});

    $(unread_target).html(html);
    $(read_target).html(html);
  },


  send_message: function (options) {

    var data = {
      subject: options.subject.value,
      text: options.text.value,
      to_client_id: options.to.value,
    }
    if (options.parent_message_id) data.parent_message_id = options.parent_message_id;

    $.ajax({
      type: 'POST',
      url: mod.URLS.create_message,
      dataType: 'json',
      data: data,
      success: function (response) {
        if (response.success) {
          mod.utils.notify('Message sent!');
        } else {
          mod.utils.notify('Error sending message. Check the user ID.');
        }
      }
    }).done(function () {
      if (options.callback) options.callback();
    });


  }


};
