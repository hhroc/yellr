'use strict';
var mod = mod || {};

window.onload = function () {

    // check for dependencies
    if (!Handlebars || !$) {
      console.log('missing dependencies for mod.utils.render_template');
      return;
    }

    // ----------------------------

    // check for pre-existing data, if none, create it
    if (localStorage.getItem('yellr-mod') === null) localStorage.setItem('yellr-mod', JSON.stringify({TOKEN: undefined }));

    // get auth token
    mod.TOKEN = JSON.parse(localStorage.getItem('yellr-mod')).TOKEN;

    console.log(mod.TOKEN);

    // check that we have a valid token
    if (mod.TOKEN === undefined) {
      // redirect to login page, if we're not there already
      if (document.querySelector('body').getAttribute('data-page') !== 'login') {
        /* TODO: use a real url */
        alert('Must login. Missing authentication token.');
        window.location.replace('http://127.0.0.1:8000/moderator/login.html');

      }
    }
    // else if (mod.TOKEN !== expired) {};


    // ===================================



    // get current page
    var page = document.querySelector('body').getAttribute('data-page');
    if (page === 'login') mod.login.init();





    // moderator.demo.loadData();


    // document.querySelector('#post-question-btn').onclick = function() {
    //   mod.utils.show_overlay({
    //     template: '#post-question-template'
    //   });
    // }


    // // #reply-template


    // // if on messages, render inbox
    // if (document.querySelector('#inbox')) {

    //   // hook up the button
    //   document.querySelector('#new-message-btn').onclick = function() {
    //     mod.utils.show_overlay({
    //       template: '#send-message-template'
    //     });
    //   }


    //   // setup inbox
    //   inbox.init({
    //     data_url: 'data/messages.json',
    //     template: '#inbox-li',
    //     container: '#inbox',
    //     read_target: '#read-mail-list',
    //     unread_target: '#unread-mail-list'
    //   });


    // } else {
    //   moderator.main.init();
    // }
}
