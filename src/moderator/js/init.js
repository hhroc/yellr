'use strict';
var mod = mod || {};

window.onload = function () {

    // check for dependencies
    if (!Handlebars || !$) {
      console.log('missing dependencies for yellr.utils.render_template');
      return;
    }


    moderator.demo.loadData();


    document.querySelector('#post-question-btn').onclick = function() {
      mod.utils.show_overlay({
        template: '#post-question-template'
      });
    }


    // #reply-template


    // if on messages, render inbox
    if (document.querySelector('#inbox')) {

      // hook up the button
      document.querySelector('#new-message-btn').onclick = function() {
        mod.utils.show_overlay({
          template: '#send-message-template'
        });
      }


      // setup inbox
      inbox.init({
        data_url: 'data/messages.json',
        template: '#inbox-li',
        container: '#inbox',
        read_target: '#read-mail-list',
        unread_target: '#unread-mail-list'
      });


    } else {
      moderator.main.init();
    }
}
