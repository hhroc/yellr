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



  load_localStorage: function () {

    var data = JSON.parse(localStorage.getItem('yellr'));
    // set values for DATA, SETTINGS, UUID
    yellr.DATA      = data.DATA;
    yellr.SETTINGS  = data.SETTINGS;
    yellr.UUID      = data.UUID;
    yellr.URLS      = data.URLS;

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
    }));
  },



  set_urls: function () {

    /**
     * use development urls or production urls
     * if a user creates a new UUID, we have to change our API calls accordingly
     */

    // two sets of URLS
    var dev_urls = {
          assignments: 'http://127.0.0.1:8080/get_assignments.json?client_id='+yellr.UUID+'&language_code='+yellr.SETTINGS.language.code+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng,
          notifications: 'http://127.0.0.1:8080/get_notifications.json?client_id='+yellr.UUID,
          messages: 'http://127.0.0.1:8080/get_messages.json?client_id='+yellr.UUID,
          news_feed: '',
          profile: '',
          upload: 'http://127.0.0.1:8080/upload_media.json',
          post: 'http://127.0.0.1:8080/publish_post.json'

        };

    var live_urls = {
          assignments: 'http://yellrdev.wxxi.org/get_assignments.json?client_id='+yellr.UUID+'&language_code='+yellr.SETTINGS.language.code+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng,
          notifications: 'http://yellrdev.wxxi.org/get_notifications.json?client_id='+yellr.UUID,
          messages: 'http://yellrdev.wxxi.org/get_messages.json?client_id='+yellr.UUID,
          news_feed: '',
          profile: '',
          upload: 'http://yellrdev.wxxi.org/upload_media.json',
          post: 'http://yellrdev.wxxi.org/publish_post.json'

        };

    // if in devevlopment, use local URLs
    return (DEBUG) ? dev_urls : live_urls;

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

    // replace html, or return HTML frag
    if (settings.target) {
      if (settings.append) $(settings.target).append(html);
      else $(settings.target).html(html);
    }
    else return html;

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



  notify: function(message) {

    /**
     * this function follows the idea of Flask's "flash message"
     */

     console.log('notify: ' + message);


    // // cache the DOM Nofitications button
    // var notifications_btn = document.querySelector('#notifications-btn');

    // // add class to show new Notication has been received
    // $(notifications_btn).addClass('new');
    // // NOTE:
    // // because we clear and recompile the HTML with Handlebar templates
    // // we automatically clear the 'new' class from the button
    // // this is convenient
    // // but, if a user goes to 'Messages' and then goes back, the class will be gone
    // // even though the user did not view the new Notification
    // // this is because the Handlebar template does not change
    // // console.log('remove class when new notification is viewed');
    // console.log('make new <li> in notifications list');
    // yellr.utils.render_template({
    //   template: '#post-submitted-li',
    //   target: '#recent-notifications',
    //   context: e,
    //   append: true
    // })
    // console.log(e);
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

    console.log('open camera');

    // navigator.camera.getPicture(
    //   function(imgData) {

    //     // yellr.route('#submit-form');
    //     document.querySelector('#img-preview').src = 'data:image/jpeg;base64,'+imgData;
    //   },
    //   function(error) {
    //     alert('Photo Capture fail: ' + error);
    //   },
    //   {
    //     quality: 50,
    //     destinationType: Camera.DestinationType.DATA_URL
    //   }
    // );

  },



  open_gallery: function () {
    console.log('hello from: open_gallery');
  },



  prompt: function (title, choices) {

    $('#overlay-container').addClass('show');

    // add event listner to conainer to close if user wants to cancel
    $('#overlay-container').on('tap', function (e) {
      e.preventDefault();
      if (e.target.className === 'vertical-center') {
        $('#overlay-container').removeClass('show');
      }
    });


    // make the HTML
    this.render_template({
      template: '#prompt-template',
      target: '#overlay',
      context: {
        title: title,
        choices: choices
      }
    });


    // setup event listeners
    for (var i = 0; i < choices.length; i++) {
      console.log(choices[i].callback);

      var node = '#prompt-'+i;
      var callback = choices[i].callback;
      var thing = $(node);
      // debugger;
      $(node).on('tap', function (e) {
        // callback();
        console.log('hahahahah');
        console.log(i);
      });
    };

  },



  setup_report_bar: function() {
    // Media capture (audio, video, photo, text)

    $('#capture-image').on('tap', function(e) {
      e.preventDefault();

      // show overlay, popup thing
      yellr.utils.prompt('Choose image source',
        [
          {
            title: 'Use camera',
            callback: yellr.utils.open_camera
          },
          {
            title: 'Open gallery',
            callback: yellr.utils.open_gallery
          }
        ]);
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
