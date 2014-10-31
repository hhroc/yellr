'use strict';
var yellr = yellr || {};

/**
 * utility functions
 * ===================================
 * load_localStorage - load localStorage
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
    yellr.utils.set_urls(BASE_URL);

    // load the language
    $.getJSON(jsonFile, function (response) {
      // set data to SCRIPT object
      yellr.SCRIPT = response;
      yellr.utils.save();
    }).done(function () {
      yellr.utils.load('stories');
      yellr.utils.load('assignments', function () {
        yellr.utils.redirect('#assignments');
      });
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
      }
    };

    // set urls || BASE_URL is set in init.js
    yellr.utils.set_urls(yellr.BASE_URL);
    // yellr.URLS

    // get the "script"
    // we add this completely so that we don't wait on load time
    yellr.SCRIPT = {
      all_posts_are_anonymous: "All posts are anonymous.",
      anonymous: "Anonymous",
      you_have_a_new_message: "You have a new message!",
      alert: "Alert",
      ready: "Ready",
      ok: "OK",
      delete: "Delete",
      error_taking_video: "Error taking video",
      captured_x_files: "captured: [#] files",
      use_camera: "Use camera",
      open_gallery: "Open gallery",
      assignment: "Assignment",
      assignments: "Assignments",
      view_assignment: "View Assignment",
      no_assignments_yet: "No assignments yet!",
      check_back_later_for_assignments: "Check back later to see if there's anything new!",
      contribute: "Contribute",
      deadline: "Deadline",
      tell_us_more: "Tell us more...",
      whats_on_your_mind: "What's on your mind?",
      tell_us_the_story: "Tell us the story...",
      news_feed: "News Feed",
      news_story: "News Story",
      messages: "Messages",
      view_message: "View Message",
      reply: "Reply",
      no_news_in_your_area: "No news stories yet in your area.",
      get_your_voice_heard: "By submitting things imporant to you, you can get your voice heard!",
      notifications: "Notifications",
      recent: "Recent",
      older: "Older",
      profile: "Profile",
      language: "Language",
      account: "Account",
      sign_in: "Sign In",
      create_account: "Create account",
      generate_new_uuid: "Generate new UUID",
      settings: "Settings",
      submit_report: "Submit Report",
      add_image_description: "Add image description (optional)",
      add_video_description: "Add video description (optional)",
      add_audio_description: "Add audio description (optional)",
      choose_image_source: "Choose Image Source",
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
    yellr.SCRIPT    = data.SCRIPT;

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

        // parse UTC time
        response[dataType] = response[dataType].filter(function (val, i, arr) {
          if (val.expire_datetime) val.expire_datetime = moment(val.expire_datetime).fromNow(true);
          return true;
        });

        // add an ID to stories, we use it on the client-side only
        if (dataType === 'stories') {
          response[dataType] = response[dataType].filter(function (val, i, arr) {
            val.id = i;
            val.contents = marked(val.contents);
            return true;
          });

        }

        // set the new data to the DATA object
        yellr.DATA[dataType] = response[dataType];
        yellr.utils.save();

      } else {
        yellr.utils.notify('Something went wrong loading '+dataType + ' from the server.');
      }
    }).done(function () {
      if (callback) callback();
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



  set_urls: function (base_url) {

    /**
     * use development urls or production urls
     * if a user creates a new UUID, we have to change our API calls accordingly
     */

    yellr.URLS = {
      assignments:    base_url+'get_assignments.json?client_id='+yellr.UUID+'&language_code='+yellr.SETTINGS.language.code+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng,
      notifications:  base_url+'get_notifications.json?client_id='+yellr.UUID,
      messages:       base_url+'get_messages.json?client_id='+yellr.UUID,
      stories:        base_url+'get_stories.json?client_id='+yellr.UUID+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng+'&language_code='+yellr.SETTINGS.language.code,
      profile:        base_url+'todo',
      upload:         base_url+'upload_media.json',
      post:           base_url+'publish_post.json',
      server_info:    base_url+'server_info.json',
      send_message:   base_url+'create_response_message.json'
    };

  },



  render_template: function(settings) {
    /**
     * Dependencies: Handlebar.js, jQuery.js
     *
     * settings = {
     *   template: '#script-id',
     *   target: '#query-string',
     *   context: {},
     *   append: boolean (optional),
     *   prepend: boolean (optional)
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


  pulldown_to_refresh: function (settings) {

    /**
     * first-run at pull-down to refresh thing
     * (not really that smooth on older mobile browsers)
     * BUG: fires when we go both up or down
     *       should only fire if we pull down
     *
     * settings = {
     *   target: '#id-string',
     *   container: '#page-container'
     *   callback:  function () {
     *     // do things after the pulldown
     *   }
     * }
     */

    // var $pulldown_target = $(settings.target),
    //     $pulldown_container = $(settings.container),
    //     startY = 0,
    //     reload_boolean = false;

    // // .pull-down-container has a transition style on it
    // // to help make a nice animation
    // $pulldown_container.addClass('pull-down-container');

    // // remove eventListeners just in case
    // $pulldown_target.off('touchstart');
    // $pulldown_target.off('touchmove');
    // $pulldown_target.off('touchend');


    // // only refresh if we are at the top of the page
    // $pulldown_target.on('touchstart', function(e){
    //   if (window.pageYOffset < 10) reload_boolean = true;
    // });

    // //
    // $pulldown_target.on('touchmove', function(e) {

    //   if (reload_boolean) {
    //     startY++;

    //     $pulldown_container.css('margin-top', (startY*20).toString()+'px');

    //     if (startY >= 3) {
    //       startY = 0;
    //       reload_boolean = false;
    //       $pulldown_container.css('margin-top', '0');
    //       // on pulldown --> run callback
    //       if (settings.callback) settings.callback();
    //     }
    //   }

    // });

    // $pulldown_target.on('touchend', function(e){
    //   reload_boolean = false;
    //   startY = 0;
    //   $pulldown_container.css('margin-top', '0');
    // });

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


  clearTmp: function () {
    yellr.TMP = null;
  },


  open_camera: function (callback) {

    var options = {
      quality: 50,
      sourceType: Camera.PictureSourceType.CAMERA,
      destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true
    };


    navigator.camera.getPicture(
      function(imgURI) {

        if (callback) {
          callback(imgURI);
        }


      },
      function(error) {
        yellr.utils.redirect('#');
        yellr.utils.notify('Photo Capture fail: ' + error);
      },
      options
    );

  },



  open_gallery: function (callback) {

    var options = {
      quality: 50,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE
    };

    navigator.camera.getPicture(
      function(imgURI) {

        if (callback) callback(imgURI);

      },
      function(error) {
        yellr.utils.redirect('#');
        yellr.utils.notify('Gallery fail: ' + error);
      },
      options
    );

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

      yellr.utils.choose_image_source(function (imgURI) {

        // setup report thing
        yellr.utils.redirect('#report/image');

        setTimeout(function () {
          // show an image preview
          document.querySelector('.img-preview').src = imgURI;

          // we save it to this TMP (temporaray) object
          // because we do don't submit things until people
          // press the [√] submit button
          yellr.TMP = {
            file: {
              type: 'image',
              uri: imgURI
            }
          };
        }, 1000);

      });

    });




    // audio
    $('#capture-audio').on('tap', function() {

      navigator.device.capture.captureAudio(
        function(audioFiles) {
          yellr.utils.notify('captured: ' + audioFiles.length + ' files');
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
            yellr.utils.notify('nothing captured');
          }
          yellr.utils.notify('closed without capturing audio');
        }
      );
    });






    // video
    $('#capture-video').on('tap', function() {
      // render template
      // render_template(form);

      navigator.device.capture.captureVideo(
        function(videoFiles) {
          yellr.utils.notify('Captured ' + videoFiles.length + ' videos');
          var html = '';

          for (var i = 0; i < videoFiles.length; i++) {
            var name = videoFiles[i].name;
            var path = videoFiles[i].fullPath;
            html += name + ' | ' + path + '<br/>';
          };
          document.querySelector('#cordova-video').innerHTML = html;
        },
        function(error) {
          yellr.utils.notify('error taking video');
        }
      );
    });

  },


  choose_image_source: function (callback) {

      yellr.utils.prompt(
        yellr.SCRIPT.choose_image_source,

        [{title: yellr.SCRIPT.use_camera}, {title: yellr.SCRIPT.open_gallery}],
        // callback funcions.. maybe?
        [function () {
          yellr.utils.open_camera(function (imgURI) {
            callback(imgURI);
          });
          // end open_camera
        },
        function () {
          yellr.utils.open_gallery(function (imgURI) {
            callback(imgURI);
          });
          // end open_gallery
        }]
      );

  }


};
