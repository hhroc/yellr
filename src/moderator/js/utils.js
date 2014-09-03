'use strict';
var mod = mod || {};

mod.utils = {


  redirect_to_login: function (message) {

    if (document.querySelector('body').getAttribute('data-page') !== 'login') {
      /* TODO: use a real url */
      alert( (message) ? message : 'Must login' );
      window.location.replace('http://127.0.0.1:8000/moderator/login.html');
    }

  },


  login: function () {

    var $form = $('#mod-login');

    $form.submit(function (e) {

      e.preventDefault();
      var fields = $form.serializeArray(),
          username = fields[0].value,
          password = fields[1].value;

      // SET THE URLS HERE NOW THAT WE HAVE A USERNAME AND PASSWORD
      var dev_url = 'http://127.0.0.1:8080/admin/get_access_token.json?user_name='+username+'&password='+password,
          live_url = 'http://yellrdev.wxxi.org/admin/get_access_token.json?user_name='+username+'&password='+password;


      // $form
      $.ajax({
        type: 'POST',
        url: (DEBUG) ? dev_url : live_url,
        dataType: 'json',
        success: function (data) {
          if (data.success) {
            mod.TOKEN = data.token;
            mod.utils.save();
            mod.utils.set_urls();

            window.location.href = (DEBUG) ? 'http://127.0.0.1:8000/moderator/latest-posts.html' : '/latest-posts.html';
          } else {
            document.querySelector('#login-feedback').innerHTML = data.error_text;
          }
        }
      });
    });

  },


  load_localStorage: function () {

    // get auth token
    var local = JSON.parse(localStorage.getItem('yellr-mod'));
    mod.DATA        = local.DATA;
    mod.SETTINGS    = local.SETTINGS;
    mod.TOKEN       = local.TOKEN;
    mod.URLS        = local.URLS;

  },


  load: function (dataType, callback) {

    // setup our data object
    if (mod.DATA === undefined) mod.DATA = {};

    // do te things
    $.getJSON(mod.URLS[dataType], function(response) {

      if (response.success) {
        mod.DATA[dataType] = response[dataType];
        mod.utils.save();

        if (callback) callback();
      } else {

        mod.utils.redirect_to_login(''+
          'Something went wrong loading: '+ dataType+'\n'+
          'This could be because your previous session has expired. Please log back in');

      }
    });
    // /end getJSON

  },


  save: function() {

    localStorage.setItem('yellr-mod', JSON.stringify({
      DATA      : mod.DATA,
      SETTINGS  : mod.SETTINGS,
      TOKEN     : mod.TOKEN,
      URLS      : mod.URLS
    }));

  },


  set_urls: function (username, password) {

    var dev_urls = {
      posts:              'http://127.0.0.1:8080/admin/get_posts.json?token='+mod.TOKEN,
      messages:           'http://127.0.0.1:8080/admin?token='+mod.TOKEN,
      create_message:     'http://127.0.0.1:8080/admin/create_message.json?token='+mod.TOKEN,
      create_question:    'http://127.0.0.1:8080/admin/create_question.json?token='+mod.TOKEN,
      create_collection:  'http://127.0.0.1:8080/admin/create_collection.json?token='+mod.TOKEN,
      publish_assignment: 'http://127.0.0.1:8080/admin/publish_assignment.json?token='+mod.TOKEN,
      languages:          'http://127.0.0.1:8080/admin/get_languages.json?token='+mod.TOKEN
    }

    var live_urls = {
      posts:              'http://yellrdev.wxxi.org/admin/get_posts.json?token='+mod.TOKEN,
      messages:           'http://yellrdev.wxxi.org/admin?token='+mod.TOKEN,
      create_message:     'http://yellrdev.wxxi.org/admin/create_message.json?token='+mod.TOKEN,
      create_question:    'http://yellrdev.wxxi.org/admin/create_question.json?token='+mod.TOKEN,
      create_collection:  'http://yellrdev.wxxi.org/admin/create_collection.json?token='+mod.TOKEN,
      publish_assignment: 'http://yellrdev.wxxi.org/admin/publish_assignment.json?token='+mod.TOKEN,
      languages:          'http://yellrdev.wxxi.org/admin/get_languages.json?token='+mod.TOKEN
    }

    mod.URLS = (DEBUG) ? dev_urls : live_urls;
    mod.utils.save();

  },



  show_overlay: function (args) {

    var overlay = document.querySelector('#overlay-div-container');
    overlay.className = 'active';

    // listen for a close event
    overlay.onclick = mod.utils.clear_overlay;


    if (args) {
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

  },




  setup_sidebar: function () {
    // set up the Post question form
    // it is ony evry page
    document.querySelector('#post-question-btn').onclick = mod.assignments.setup_form;

  }


};
