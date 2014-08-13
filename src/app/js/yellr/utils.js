'use strict';
var yellr = yellr || {};

/**
 * utility functions
 * ===================================
 *
 * - render_template
 * - render_list
 * - clearNode
 */


yellr.utils = {

  no_subnav: function() {
    /**
     * convenience function. call it to remove the subnav
     */

    this.render_template({
      target: '#app-subnav',
      template: ''
    })
  },

  save: function() {
    /**
     * Saves/updates our yellr.localStorage
     */

    localStorage.setItem('yellr', JSON.stringify({DATA: yellr.DATA, SETTINGS: yellr.SETTINGS, UUID: yellr.UUID }));
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
      // if (settings.append) $(settings.target).append(html);
      $(settings.target).html(html);
    }
    else return html;

  },


  clearNode: function(DOMnode) {
    while(DOMnode.hasChildNodes())
      DOMnode.removeChild(DOMnode.firstChild);
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


  setup_report_bar: function() {
    // Media capture (audio, video, photo, text)
    // ===================================


    // image
    // ----------------------------
    // var cameraOptions = {
    //  quality : 75,
    //  destinationType : Camera.DestinationType.DATA_URL,
    //  sourceType : Camera.PictureSourceType.CAMERA,
    //  allowEdit : true,
    //  encodingType: Camera.EncodingType.JPEG,
    //  targetWidth: 100,
    //  targetHeight: 100,
    //  saveToPhotoAlbum: false
    // };

    $('#capture-image').on('tap', function() {

      navigator.camera.getPicture(
        function(imgData) {

          // yellr.route('#submit-form');
          document.querySelector('#img-preview').src = 'data:image/jpeg;base64,'+imgData;
        },
        function(error) {
          alert('Photo Capture fail: ' + error);
        },
        {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL
        }
      );
    });
    // // double tap to select from camera roll
    // $('#capture-image').on('doubleTap', function() {
    //   alert('double tap. always double tap');
    // });
    // // long tap to select from camera roll
    // $('#capture-image').on('longTap', function() {
    //   alert('long tap');
    // });







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

    // lowly ol' text
    $('#capture-text').on('tap', function() {
      // render template
      // render_template(form);
    });

  },


  notify: function(e) {
    // cache the DOM Nofitications button
    var notifications_btn = document.querySelector('#notifications-btn');

    // add class to show new Notication has been received
    $(notifications_btn).addClass('new');
    // NOTE:
    // because we clear and recompile the HTML with Handlebar templates
    // we automatically clear the 'new' class from the button
    // this is convenient
    // but, if a user goes to 'Messages' and then goes back, the class will be gone
    // even though the user did not view the new Notification
    // this is because the Handlebar template does not change
    // console.log('remove class when new notification is viewed');
    console.log('make new <li> in notifications list');
    yellr.utils.render_template({
      template: '#post-submitted-li',
      target: '#recent-notifications',
      context: e,
      append: true
    })
    console.log(e);
  },


  clearForm: function() {
    // for all the forms, clear the data
    var forms = document.querySelectorAll('#form-wrapper form.target');
    for (var i = 0; i < forms.length; i++) {
      forms[i].className='';
      forms[i].reset();
    };
  }

};
