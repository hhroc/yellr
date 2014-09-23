'use strict';
var yellr = yellr || {};

/**
 * utility functions
 * ===================================
 * load_localStorage - load localtorage
 * load - load data from server
 * save - save yellr object to local storage
 * set_urls - set API urls
 * render_template - generate our Handlebar templates
 * guid - generate a unique identifier
 * notify - make q quick 'pop up' to notify user of activity
 * no_subnav - remove the subnav easily from a page
 *
 */


yellr.utils = {


  change_language: function (language) {
    var jsonFile = 'data/languages/'+language+'.json',
        short_code = language.substr(0,2);

    yellr.utils.notify('Changing language to: ' + language);

    moment.locale(short_code);

    yellr.SETTINGS.language.set(short_code);
    yellr.utils.set_urls();

    // load the language
    $.getJSON(jsonFile, function (response) {
      // set data to SCRIPT object
      yellr.SCRIPT = response;
      yellr.utils.save();
    }).done(function () {
      yellr.utils.load('stories');
      yellr.utils.load('assignments');
    });
  },


  create_user: function (settings) {

    /**
     * creates a new user profile
     *
     * NOTE: MUST RUN yellr.utis.save() in order to save profile
     */

    // version #
    yellr.VERSION = {
      server_version: '0.0.1',
      required_client_version: '0.0.1'
    };

    // create a new user ID
    yellr.UUID = yellr.utils.guid();

    // default settings
    yellr.SETTINGS = {
      // default to Rochester, NY :)
      lat: 43.2,
      lng: -77.6,
      language: {
        code: 'en',
        name: 'English',
        set: function(lang) {
          // pass in a code from Cordova api
          this.code = lang;

          // decipher
          if (lang === 'en') this.name = 'English';  // *
          if (lang === 'es') this.name = 'Español';  // *
          if (lang === 'fr') this.name = 'French';   // *

          // * - from HTC Inspire (Android)
        }
      },
      app: {
        // to do
        // phone specific settings
      }
    };

    // set urls
    yellr.utils.set_urls();

    // get the "script"
    // we add this completely so that we don't wait on load time
    yellr.SCRIPT = {
      you_have_a_new_message: "You have a new message!",
      alert: "Alert",
      ready: "Ready",
      ok: "OK",
      error_taking_video: "Error taking video",
      captured_x_files: "captured: [#] files",
      assignments: "Assignments",
      view_assignment: "View Assignment",
      news_feed: "News Feed",
      no_assignments_yet: "No assignments yet!",
      check_back_later_for_assignments: "Check back later to see if there's anything new!",
      contribute: "Contribute",
      deadline: "Deadline",
      choose_image_source: "Choose Image Source",
      use_camera: "Use camera",
      open_gallery: "Open gallery",
      all_posts_are_anonymous: "All posts are anonymous.",
      messages: "Messages",
      delete: "Delete",
      no_news_in_your_area: "No news stories yet in your area.",
      get_your_voice_heard: "By submitting things imporant to you, you can get your voice heard!",
      notifications: "Notifications",
      recent: "Recent",
      older: "Older",
      profile: "Profile",
      generate_new_uuid: "Generate new UUID",
      create_account: "Create a verified account",
      settings: "Settings",
      submit_report: "Submit Report",
      whats_on_your_mind: "What's on your mind?",
      add_image_description: "Add image description (optional)",
      add_video_description: "Add video description (optional)",
      add_audio_description: "Add audio description (optional)",
      choose_files: "Choose Files",
      add_extra_media: "Add extra media:"
    };

  },



  check_version: function () {
    $.getJSON(yellr.URLS.server_info,
      function (response) {
        if (response.success) {
          // some vars
          var server_version_ok = true,
              required_client_version_ok = true,
              server_feedback = 'The server version associated with this app is out of date.',
              client_feedback = 'This app is out of date and needs to updated.',
              text = '';

          // do the check, brah
          if (yellr.VERSION.server_version !== response.server_version) {
            server_version_ok = false;
            text = server_feedback;
          }
          if (yellr.VERSION.required_client_version !== response.required_client_version) {
            required_client_version_ok = false;
            text = client_feedback;
          }

          // lat minute text things

          if (!server_version_ok && !required_client_version_ok)
          {
            text = 'Both the app and server are out of date. Please update.';
            yellr.utils.notify(text)
          } else if (!server_version_ok || !required_client_version_ok)
          {
            yellr.utils.notify(text)
          }

        } else {
          console.log('Could not verify software version.');
        }
      }
    )
  },



  load_localStorage: function () {

    var data = JSON.parse(localStorage.getItem('yellr'));
    // set values for DATA, SETTINGS, UUID
    yellr.DATA      = data.DATA;
    yellr.SETTINGS  = data.SETTINGS;
    yellr.UUID      = data.UUID;
    yellr.URLS      = data.URLS;
    yellr.VERSION   = data.VERSION;

  },



  load: function (dataType, callback) {

    /**
     * ping the yellr server to get data
     */

    // make sure we have our data object
    if (yellr.DATA === undefined) yellr.DATA = {};

    // load the things
    $.getJSON(yellr.URLS[dataType], function (response) {
      if (response.success) {

        yellr.DATA[dataType] = response[dataType];
        yellr.utils.save();

        if (callback) callback();

      } else {
        yellr.utils.notify('Something went wrong loading '+dataType + ' from the server.');
      }
    });

  },



  save: function() {
    /**
     * Saves/updates our yellr.localStorage
     */

    localStorage.setItem('yellr', JSON.stringify({
      DATA: yellr.DATA,
      SETTINGS: yellr.SETTINGS,
      URLS: yellr.URLS,
      UUID: yellr.UUID,
      VERSION: yellr.VERSION,
      SCRIPT: yellr.SCRIPT
    }));
  },



  set_urls: function () {

    /**
     * use development urls or production urls
     * if a user creates a new UUID, we have to change our API calls accordingly
     */

    var base_url = (DEBUG) ? 'http://127.0.0.1:8080/' : 'http://yellrdev.wxxi.org/';
    // var base_url = 'http://yellrdev.wxxi.org/';

    // two sets of URLS
    var urls = {
          assignments:    base_url+'get_assignments.json?client_id='+yellr.UUID+'&language_code='+yellr.SETTINGS.language.code+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng,
          notifications:  base_url+'get_notifications.json?client_id='+yellr.UUID,
          messages:       base_url+'get_messages.json?client_id='+yellr.UUID,
          stories:        base_url+'get_stories.json?client_id='+yellr.UUID+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng+'&language_code='+yellr.SETTINGS.language.code,
          profile:        base_url+'todo',
          upload:         base_url+'upload_media.json',
          post:           base_url+'publish_post.json',
          server_info:    base_url+'server_info.json'
        };

    // if in devevlopment, use local URLs
    yellr.URLS = urls;

  },



  render_template: function(settings) {
    /**
     * Dependencies: Handlebar.js, zepto.js (or jQuery.js)
     *
     * settings = {
     *   template: '#script-id',
     *   target: '#query-string',
     *   context: {}
     * }
     */

    if (!Handlebars || !$) {
      // missing dependencies
      console.log('missing dependencies for yellr.utils.render_template');
      return;
    }

    // get Handlebar template
    if (!settings.template || settings.template ==='') {
      $(settings.target).html(''); // if template is empty, clear HTML of target
      return;
    };
    var template = Handlebars.compile($(settings.template).html());

    // render it (check it we have a context)
    var html = template( settings.context ? settings.context : {} );

    if (settings.append) $(settings.target).append(html);
    else if (settings.prepend) $(settings.target).prepend(html);
    else $(settings.target).html(html);

  },



  guid: function (len, radix) {
    /*!
      Math.uuid.js (v1.4)
      http://www.broofa.com
      mailto:robert@broofa.com
      http://www.broofa.com/2008/09/javascript-uuid-function/

      Copyright (c) 2010 Robert Kieffer
      Dual licensed under the MIT and GPL licenses.
    */
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var chars = CHARS, uuid = [], i;
    radix = radix || chars.length;

    if (len) {
      // Compact form
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
    } else {
      // rfc4122, version 4 form
      var r;

      // rfc4122 requires these characters
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      // Fill in random data.  At i==19 set the high bits of clock sequence as
      // per rfc4122, sec. 4.1.5
      for (i = 0; i < 36; i++) {
        if (!uuid[i]) {
          r = 0 | Math.random()*16;
          uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },



  check_notifications: function () {
    console.log('check notifications');
    console.log(yellr.DATA.notifications);
    if (yellr.DATA.notifications) {
      yellr.utils.notify('You have a new message!');
    };
  },



  check_messages: function () {
    console.log('check_messages');
    console.log(yellr.DATA.messages);
  },




  notify: function(message, time) {

    /**
     * this function follows the idea of Flask's "flash message"
     */

    // default to 3 seconds, can override with parameter
    var _time = (time) ? time: 3500;

    // if a messsage was passed, show that
    // alert('notify: ' + message);
    yellr.utils.render_template({
      template: '#notify-tmpl',
      target: '#notify-list',
      context: {
        message: message
      },
      append: true
    })

    // we set the height inline so we can transition nicely
    $('#notify-wrapper').css('height', $('#notify-list').css('height'));

    // delete notifications after a while
    setTimeout(function () {
      document.querySelector('#notify-list').removeChild(document.querySelector('#notify-list').firstChild);
      $('#notify-wrapper').css('height', $('#notify-list').css('height'));
    }, _time);

  },


  redirect: function (hash_string) {
    window.location.href=hash_string;
  },



  no_subnav: function() {
    /**
     * convenience function. call it to remove the subnav
     */

    this.render_template({
      target: '#app-subnav',
      template: ''
    })
  },




  clearNode: function(DOMnode) {
    while(DOMnode.hasChildNodes())
      DOMnode.removeChild(DOMnode.firstChild);
  },



  open_camera: function () {


    navigator.camera.getPicture(
      function(imgURI) {

        // setup report thing
        yellr.utils.redirect('#report/image');

        // show an image preview
        document.querySelector('.img-preview').src = imgURI;

        // do some memory cleanup
        // "Removes intermediate image files that are kept in temporary
        // storage after calling camera.getPicture"
        // navigator.camera.cleanup(function ()
        // {
        //   console.log("Camera cleanup success.")
        // }, function (message)
        // {
        //   console.log('Failed because: ' + message);
        // });

      },
      function(error) {
        yellr.utils.redirect('#');
        console.log('Photo Capture fail: ' + error);
      },
      {
        quality: 50,
        sourceType: Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.FILE_URI,
        // allowEdit : true,
        encodingType: Camera.EncodingType.JPEG,
        correctOrientation: true,
        saveToPhotoAlbum: true
      }
    );

  },



  open_gallery: function () {
    console.log('hello from: open_gallery');
    yellr.utils.redirect('#report/image');

  },


  show_overlay: function () {

    var $overlay = $('#overlay-container');

    $overlay.addClass('show');

    // add event listner to conainer to close if user wants to cancel
    $overlay.on('tap', function (e) {
      e.preventDefault();
      if (e.target.className === 'vertical-center') {
        yellr.utils.hide_overlay();
      }
    });

  },
  hide_overlay: function () {
    $('#overlay-container').removeClass('show');
  },



  prompt: function (title, choices, setup) {

    yellr.utils.show_overlay();

    // make the HTML
    this.render_template({
      template: '#prompt-template',
      target: '#overlay',
      context: {
        title: title,
        choices: choices
      }
    });


    $('#prompt-0').on('tap', function (e) {
      yellr.utils.hide_overlay();
      setup[0]();
    });

    $('#prompt-1').on('tap', function (e) {
      yellr.utils.hide_overlay();
      setup[1]();
    });

  },



  setup_report_bar: function() {
    // Media capture (audio, video, photo, text)

    $('#capture-image').on('tap', function(e) {
      // e.preventDefault();

      // show overlay, popup thing
      yellr.utils.prompt(
        'Choose image source',
        [{title: 'Use camera'}, {title: 'Open gallery'}],
        [yellr.utils.open_camera, yellr.utils.open_gallery ]
      );
    });




    // audio
    $('#capture-audio').on('tap', function() {
      // render template
      // render_template(form);

      navigator.device.capture.captureAudio(
        function(audioFiles) {
          alert('captured: ' + audioFiles.length + ' files');
          var html = '';
          for (var i = 0; i < audioFiles.length; i++) {
            var path = audioFiles[i].fullPath;
            var name = audioFiles[i].name;
            html += name + ' | ' + path + '<br/>';
          };
          document.querySelector('#cordova-audio').innerHTML = html;
        },
        function(error) {
          if (error.CAPTURE_NO_MEDIA_FILES) {
            alert('nothing captured');
          }
          alert('closed without capturing audio');
        }
      );
    });






    // video
    $('#capture-video').on('tap', function() {
      // render template
      // render_template(form);

      navigator.device.capture.captureVideo(
        function(videoFiles) {
          alert('Captured ' + videoFiles.length + ' videos');
          var html = '';

          for (var i = 0; i < videoFiles.length; i++) {
            var name = videoFiles[i].name;
            var path = videoFiles[i].fullPath;
            html += name + ' | ' + path + '<br/>';
          };
          document.querySelector('#cordova-video').innerHTML = html;
        },
        function(error) {
          alert('error taking video');
        }
      );
    });

  }


};
