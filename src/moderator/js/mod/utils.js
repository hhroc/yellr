'use strict';
var mod = mod || {};

mod.utils = {

    main_setup: function () {
      // set up the Post question form
      // it is ony evry page
      document.querySelector('#post-question-btn').onclick = mod.new_assignment.setup_form;


      // if on messages, render inbox
      if (document.querySelector('#inbox')) {

        // setup inbox
        mod.messages.init({
          data_url: 'data/messages.json',
          template: '#inbox-li',
          container: '#inbox',
          read_target: '#read-mail-list',
          unread_target: '#unread-mail-list'
        });

        // hook up the button
        document.querySelector('#new-message-btn').onclick = function() {
          mod.utils.show_overlay({
            template: '#send-message-template'
          });

          mod.messages.create_message();

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
              }
            })
          })
        }

      }

    },


    save: function() {
      localStorage.setItem('yellr-mod', JSON.stringify({
        TOKEN: mod.TOKEN,
        LANGUAGES: mod.LANGUAGES,
        DATA: mod.DATA
      }));
    },


    show_overlay: function (args) {

      var overlay = document.querySelector('#overlay-div-container');
      overlay.className = 'active';

      // listen for a close event
      overlay.onclick = mod.utils.clear_overlay;


      if (args.template) {
        this.render_template({
          template: args.template,
          context: args.context,
          target: overlay
        })
      }

    },



    clear_overlay: function (e) {
      if (e === undefined || e.target.id === 'overlay-div-container') {
        var overlay = document.querySelector('#overlay-div-container');
        overlay.className = '';
        overlay.removeEventListener('click', mod.utils.clear_overlay,false);
        return;
      }
    },




    render_template: function(settings) {
      /**
       * Dependencies: Handlebar.js, zepto.js (or jQuery.js)
       *
       * settings = {
       *   template: '#script-id',
       *   target: '#query-string',
       *   context: {},
       *   events: func
       * }
       */


      // get Handlebar template
      if (!settings.template || settings.template ==='') {
        $(settings.target).html(''); // if template is empty, clear HTML of target
        return;
      };
      var template = Handlebars.compile($(settings.template).html());

      // render it (check it we have a context)
      var html = template( settings.context ? settings.context : {} );

      // replace html, or return HTML frag
      if (settings.target) {
        if (settings.append) $(settings.target).append(html);
        else $(settings.target).html(html);
        // $(settings.target).html(html);
      }
      else return html;

    }
};


