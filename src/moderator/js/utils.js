'use strict';
var mod = mod || {};

mod.utils = {

  convert_object_to_array: function (object) {
    var array = [];
    for (var key in object) {
      array.push(object[key]);
    }
    return array;
  },


  notify: function (text) {
    // TODO
    console.log(text);
  },




  redirect_to: function (page) {
    var url_base = '/admin/';
    window.location.replace(url_base+page);
  },



  redirect_to_login: function (message) {

    if (document.querySelector('body').getAttribute('data-page') !== 'login') {
      /* TODO: use a real url */
      alert( (message) ? message : 'Must login' );
      mod.utils.redirect_to('login.html');
    }

  },


  login: function (username, password) {

    // SET THE URLS HERE NOW THAT WE HAVE A USERNAME AND PASSWORD
    var url = '/admin/get_access_token.json?user_name='+username+'&password='+password;

    // $form
    $.ajax({
      type: 'POST',
      url: url,
      dataType: 'json',
      success: function (data) {
        if (data.success) {
          mod.TOKEN = data.token;
          mod.utils.save();
          mod.utils.set_urls();

          // load languages
          $.ajax({
            url: mod.URLS.get_languages,
            type: 'POST',
            dataType: 'json',
            success: function (response) {
              if (response.success) {
                mod.DATA.languages = response.languages;
                mod.utils.save();
              } else {
                alert('Something went wrong loading Languages. Things might get weird from here...');
              }
            }
          }).done(function () {
            console.log('done loading languages');
            mod.utils.redirect_to('moderator/index.html');
          });

        } else {
          document.querySelector('#login-feedback').innerHTML = data.error_text;
        }
      }
    });

  },


  logout: function () {
    localStorage.removeItem('yellr-mod');
    mod.utils.redirect_to_login('You have been logged out');
  },


  load_localStorage: function () {

    // get auth token
    var local = JSON.parse(localStorage.getItem('yellr-mod'));
    mod.DATA        = local.DATA;
    mod.SETTINGS    = local.SETTINGS;
    mod.TOKEN       = local.TOKEN;
    mod.URLS        = local.URLS;

  },


  load: function (settings) {

    /**
     * settings = {
     *   data - is the object name of the data we want
     *   saveAs - save the reponse the the DATA object as this parameter
     *     * only works if saveAs is the same as the response, else use callback to handle it
     *   callback - do things with the server response
     * }
     */

    // setup our data object
    if (mod.DATA === undefined) mod.DATA = {};

    // do te things
    $.getJSON(mod.URLS[settings.data], function(response) {

      if (response.success) {

        // save the JSON data directly
        if (settings.saveAs) {

          // sometimes what we get back is an object
          // we iterate through the objects keys to generate an array we can use
          if (Array.isArray(response[settings.saveAs]) === false) {

            var array = [];
            for (var key in response.posts) {
              array.push(response.posts[key]);
            }
            mod.DATA[settings.saveAs] = array;

          } else {
            // if it's already an array, just set it
            mod.DATA[settings.saveAs] = response[settings.saveAs];
          }

          if (settings.saveAs === 'posts') {

            mod.DATA.posts.reverse();
          }

          // save the data
          mod.utils.save();
        }
        // or do stuff with it
        if (settings.callback) settings.callback(response);
      } else {

        console.log(response);
        console.log(mod.URLS[settings.data]);
        console.log(''+
          'Something went wrong loading: '+ settings.data+'\n'+
          'This could be because your previous session has expired. Please log back in');
        // mod.utils.redirect_to_login(''+
        //   'Something went wrong loading: '+ settings.data+'\n'+
        //   'This could be because your previous session has expired. Please log back in');


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


  set_urls: function () {

    // var base_url = (DEBUG) ? 'http://127.0.0.1:8080/admin/' : 'http://yellrdev.wxxi.org/admin/';
    var base_url = '/admin/';

    mod.URLS = {
      // get latest user posts
      get_posts:                    base_url+'get_posts.json?token='+mod.TOKEN,
      // messaging
      get_my_messages:              base_url+'get_my_messages.json?token='+mod.TOKEN,
      create_message:               base_url+'create_message.json?token='+mod.TOKEN,
      // questions/assignments
      create_question:              base_url+'create_question.json?token='+mod.TOKEN,
      get_my_assignments:           base_url+'get_my_assignments.json?token='+mod.TOKEN,
      publish_assignment:           base_url+'publish_assignment.json?token='+mod.TOKEN,
      update_assignment:            base_url+'update_assignment.json?token='+mod.TOKEN,
      get_assignment_responses:     base_url+'get_assignment_responses.json?token='+mod.TOKEN,
      // collections
      create_collection:            base_url+'create_collection.json?token='+mod.TOKEN,
      get_my_collections:           base_url+'get_my_collections.json?token='+mod.TOKEN,
      disable_collection:           base_url+'disable_collection.json?token='+mod.TOKEN,
      add_post_to_collection:       base_url+'add_post_to_collection.json?token='+mod.TOKEN,
      remove_post_from_collection:  base_url+'remove_post_from_collection.json?token='+mod.TOKEN,
      get_collection_posts:         base_url+'get_collection_posts.json?token='+mod.TOKEN,
      // meta
      get_languages:                base_url+'get_languages.json?token='+mod.TOKEN,
      get_question_types:           base_url+'get_question_types.json?token='+mod.TOKEN,
      create_user:                  base_url+'create_user.json?token='+mod.TOKEN,
      // publish
      publish_story:                base_url+'publish_story.json?token='+mod.TOKEN
    }

    // save new urls
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
    if (settings.append) $(settings.target).append(html);
    else if (settings.prepend) $(settings.target).prepend(html);
    else $(settings.target).html(html);

  },




  setup_sidebar: function () {
    // set up the Post question form
    // it is ony evry page
    document.querySelector('#post-question-btn').onclick = mod.assignments.setup_form;
    document.querySelector('#logout-btn').onclick = mod.utils.logout;
  }


};
