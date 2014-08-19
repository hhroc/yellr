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

    // check that we have a valid token, that hasn't expired
    if (mod.TOKEN === undefined) {
      // redirect to login page, if we're not there already
      if (document.querySelector('body').getAttribute('data-page') !== 'login') {
        /* TODO: use a real url */
        alert('Must login. Missing authentication token.');
        window.location.replace('http://127.0.0.1:8000/moderator/login.html');

      }
    }

    // ----------------------------


    // get current page
    var page = document.querySelector('body').getAttribute('data-page');
    if (page === 'login') mod.login.init();




    // ----------------------------
    // not sure where to put the following functions yet
    // they run on every page (most of them anyways)

    document.querySelector('#post-question-btn').onclick = function() {
      // render the form
      mod.utils.show_overlay({
        template: '#post-question-template'
      });

      // add event listeners
      var $question_form = $('#post-question-form');

      var language_select = $question_form.find('#language-select');
      console.log(language_select);

      language_select.on('change', function (e) {
        console.log(e.target);
        console.log('language selected: ');
        console.log('show form things');
      })


      // if question type is multiple_choice, show text inputs
      // else make sure it is hidden

      $question_form.submit(function (e) {
        e.preventDefault();

        console.log('submit form');
        var url = 'http://yellrdev.wxxi.org/admin/create_question.json?token='+mod.TOKEN;
        console.log('url: '+url);

        // var fields = $question_form.serializeArray(),
        //     username = fields[0].value,
        //     password = fields[1].value;

        // // $question_form
        // $.ajax({
        //   type: 'POST',
        //   url: url,
        //   success: function (data) {
        //     if (data.success) {
        //       mod.TOKEN = data.token;
        //       mod.utils.save();
        //       window.location.href = 'http://127.0.0.1:8000/moderator/latest-submissions.html';
        //     } else {
        //       document.querySelector('#login-feedback').innerHTML = data.error_text;
        //     }
        //   },
        //   dataType: 'json'
        // });
      })

    }


    // // #reply-template


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


    // } else {
    //   moderator.main.init();
    }
}
