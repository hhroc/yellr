'use strict';
var yellr = yellr || {};


// the things
yellr.utils = {


  create_user: function (settings) {

    /**
     * creates a new user profile
     *
     * NOTE: MUST RUN yellr.utis.save() in order to save profile
     */

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
          this.code = lang;

          // decipher
          if (lang === 'en') this.name = 'English';  // *
          if (lang === 'es') this.name = 'Español';  // *
          if (lang === 'fr') this.name = 'French';   // *
        }
      }
    };

    // set urls
    yellr.utils.set_urls();
  },


  set_urls: function () {

    /* BASE_URL is set in init.js */

    yellr.URLS = {
      stories:  BASE_URL+'get_stories.json?client_id='+yellr.UUID+'&lat='+yellr.SETTINGS.lat+'&lng='+yellr.SETTINGS.lng+'&language_code='+yellr.SETTINGS.language.code,
      upload:   BASE_URL+'upload_media.json',
      post:     BASE_URL+'publish_post.json'
    };

  },


  load_localStorage: function () {

    var data = JSON.parse(localStorage.getItem('yellr-frontpage'));
    yellr.SETTINGS  = data.SETTINGS;
    yellr.UUID      = data.UUID;
    yellr.URLS      = data.URLS;

  },


  save: function() {
    /**
     * Saves/updates our yellr.localStorage
     */

    localStorage.setItem('yellr-frontpage', JSON.stringify({
      SETTINGS: yellr.SETTINGS,
      URLS: yellr.URLS,
      UUID: yellr.UUID
    }));
  },


  submit_form: function() {

    var forms = document.querySelectorAll('.forms-wrapper form'),
        form_counter = 0,
        media_objects = [];

    for (var i = 0; i < forms.length; i++) {
      var form = forms[i];

      // make sure the form is not empty [returns true or false]
      if (yellr.utils.validate_form(form)) {

        $(form).ajaxSubmit({
          url: yellr.URLS.upload,
          data: {
            client_id: yellr.UUID
          },
          success: function (response) {
            if (response.success) {
              // add the media_id to our local array
              form_counter++;
              media_objects.push(response.media_id);
              if (form_counter === forms.length) {
                yellr.utils.publish_post(media_objects);
              }
            } else {
              console.log('Something went wrong with upload_media...');
              console.log(response);
            }
          },
          clearForm: true
        });
        // end ajaxSubmit
      }

    };
  },


  validate_form: function (form) {
    // return value:
    var valid = false;

    // what kind of form is it?
    if (form.id === 'text-form') {
      // make sure textarea is not empty
      if (form.querySelector('textarea').value !== '') valid = true;
      else yellr.utils.notify('The text form is empty.');

    } else {
      // we are submitting media
      // make sure input(name="media_file") is not empty
      if (form.querySelector('input[name="media_file"]').value) valid = true;
      else yellr.utils.notify('Missing media file.');
    }


    return valid
  },



  publish_post: function(media_objects) {

    $.post(yellr.URLS.post, {
      title: 'Web Submission',
      client_id: yellr.UUID,
      assignment_id: null,
      language_code: yellr.SETTINGS.language.code,
      lat: yellr.SETTINGS.lat,
      lng: yellr.SETTINGS.lng,
      media_objects: JSON.stringify(media_objects)
    }, function(e) {
      console.log('post published');
      // generate new UUID after every post to help protect anonymity
      yellr.UUID = yellr.utils.guid();
      yellr.utils.save();
    });

  },



  email_signup: function (formData) {
    // console.log('hello from: email_signup');
    // console.log('missing url');

    $.ajax({
      url: 'tbd',
      type: 'POST',
      dataType: 'json',
      data: formData,
      success: function (response) {
        alert('Thanks for signing up!');
      }
    });
  },



  notify: function (message) {
    // use alert for now
    // til we get something nicer
    alert(message);
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
      // if template is empty, clear HTML of target
      $(settings.target).html('');
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
