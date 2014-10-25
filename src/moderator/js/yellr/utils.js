'use strict';
var yellr = yellr || {};

yellr.utils = {

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
    var url_base = '/moderator/';
    window.location.replace(url_base+page);
  },



  redirect_to_login: function () {
    if (document.querySelector('body').getAttribute('data-page') !== 'login') {
      yellr.utils.redirect_to('login.html');
    }

  },



  logout: function () {
    localStorage.removeItem('yellr-mod');
    yellr.utils.redirect_to_login('You have been logged out');
  },


  load_localStorage: function () {

    // get auth token
    var local = JSON.parse(localStorage.getItem('yellr-mod'));
    yellr.DATA        = local.DATA;
    yellr.SETTINGS    = local.SETTINGS;
    yellr.TOKEN       = local.TOKEN;
    yellr.URLS        = local.URLS;

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
    if (yellr.DATA === undefined) yellr.DATA = {};

    // do te things
    $.getJSON(yellr.URLS[settings.data], function(response) {

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
            yellr.DATA[settings.saveAs] = array;

          } else {
            // if it's already an array, just set it
            yellr.DATA[settings.saveAs] = response[settings.saveAs];
          }

          if (settings.saveAs === 'posts') {

            yellr.DATA.posts.reverse();
          }

          // save the data
          yellr.utils.save();
        }
        // or do stuff with it
        if (settings.callback) settings.callback(response);
      } else {

        console.log(response);
        console.log(yellr.URLS[settings.data]);
        console.log(''+
          'Something went wrong loading: '+ settings.data+'\n'+
          'This could be because your previous session has expired. Please log back in');
        // yellr.utils.redirect_to_login(''+
        //   'Something went wrong loading: '+ settings.data+'\n'+
        //   'This could be because your previous session has expired. Please log back in');


      }
    });
    // /end getJSON

  },


  save: function() {

    localStorage.setItem('yellr-mod', JSON.stringify({
      DATA      : yellr.DATA,
      SETTINGS  : yellr.SETTINGS,
      TOKEN     : yellr.TOKEN,
      URLS      : yellr.URLS
    }));

  },


  set_urls: function () {

    var base_url = yellr.BASE_URL+'admin/';

    yellr.URLS = {
      // get latest user posts
      get_posts:                    base_url+'get_posts.json?token='+yellr.TOKEN,
      // messaging
      get_my_messages:              base_url+'get_my_messages.json?token='+yellr.TOKEN,
      create_message:               base_url+'create_message.json?token='+yellr.TOKEN,
      // questions/assignments
      create_question:              base_url+'create_question.json?token='+yellr.TOKEN,
      get_my_assignments:           base_url+'get_my_assignments.json?token='+yellr.TOKEN,
      publish_assignment:           base_url+'publish_assignment.json?token='+yellr.TOKEN,
      update_assignment:            base_url+'update_assignment.json?token='+yellr.TOKEN,
      get_assignment_responses:     base_url+'get_assignment_responses.json?token='+yellr.TOKEN,
      // collections
      create_collection:            base_url+'create_collection.json?token='+yellr.TOKEN,
      get_my_collections:           base_url+'get_my_collections.json?token='+yellr.TOKEN,
      disable_collection:           base_url+'disable_collection.json?token='+yellr.TOKEN,
      add_post_to_collection:       base_url+'add_post_to_collection.json?token='+yellr.TOKEN,
      remove_post_from_collection:  base_url+'remove_post_from_collection.json?token='+yellr.TOKEN,
      get_collection_posts:         base_url+'get_collection_posts.json?token='+yellr.TOKEN,
      // meta
      get_languages:                base_url+'get_languages.json?token='+yellr.TOKEN,
      get_question_types:           base_url+'get_question_types.json?token='+yellr.TOKEN,
      create_user:                  base_url+'create_user.json?token='+yellr.TOKEN,
      // publish
      publish_story:                base_url+'publish_story.json?token='+yellr.TOKEN,
      upload:                       yellr.BASE_URL+'upload_media.json'
    }

    // save new urls
    yellr.utils.save();

  },



  show_overlay: function (args) {

    var overlay = document.querySelector('#overlay-div-container');
    overlay.className = 'active';

    // listen for a close event
    overlay.onclick = yellr.utils.clear_overlay;


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
      overlay.removeEventListener('click', yellr.utils.clear_overlay,false);
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

  }

};
