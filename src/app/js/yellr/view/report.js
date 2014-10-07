'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.report = (function() {

    /**
     * the user report page for yellr
     */

    var form_counter = 0,
        total_forms = 0,
        media_objects = [],
        assignment_id;



    var render = function(data) {

      /**
       * get the hash (single or feed view?)
       */


      var header = data.template.header;
          header.template = '#submit-header';
          header.context = {submit_report: yellr.SCRIPT.submit_report};
      yellr.utils.render_template(header);

      yellr.utils.no_subnav();

      var footer = data.template.footer;
          footer.template = '';
      yellr.utils.render_template(footer);

      $('#submit-btn').on('tap', function (e) {
        yellr.view.report.submit_form();
      });


      // the assignment ID is in the URL
      // the URL parts are in the data.raw array
      assignment_id = (data.raw[2]) ? data.raw[2] : null;
      this.setup_form(data);
      this.setup_extra_media(data);

    }








    var setup_form = function(data, append) {

      // set up things for Handlebars
      var form = {
        template: '#'+data.id+'-form',
        target: '#form-wrapper'
      };


      // are we replying to an assignment? // grab the ID from the URL
      if (data.raw[2]) {

        // filter through the array to get right assignment
        form.context = yellr.DATA.assignments.filter(function(val, i, arr) {
          if (val.assignment_id === parseInt(data.raw[2])) return true;
        })[0];


        if (form.context === undefined) form.context = {};
        form.context.assignment_id = data.raw[2];
      }

      if (form.context === undefined) form.context = {};
      form.context.client_id = yellr.UUID;

      // add the language text (all of the things)
      form.context.add_description = yellr.SCRIPT['add_'+data.id+'_description'];
      form.context.tell_us_more = yellr.SCRIPT.tell_us_more;
      form.context.whats_on_your_mind = yellr.SCRIPT.whats_on_your_mind;
      form.context.tell_us_the_story = yellr.SCRIPT.tell_us_the_story;

      if (append) form.append = true;

      yellr.utils.render_template(form);
    }








    var setup_extra_media = function (data) {

      // add extra media bar
      yellr.utils.render_template({
        template: '#extra-media',
        target: '#extra-media-wrapper',
        context: {
          add_extra_media: yellr.SCRIPT.add_extra_media
        }
      });

      // on the submission forms we can add multiple files
      // this listener handles clicks
      $('#extra-media-wrapper div.flex').on('tap', function(e) {
        if (e.target.nodeName === 'I' || e.target.nodeName === 'DIV') {
          var form_type = (e.target.nodeName === 'I') ? e.target.parentNode.className : e.target.className;
          data.id = form_type.split('add-')[1].split(' ')[0];
          yellr.view.report.setup_form(data, true);
        }
      });

    }








    var submit_form = function() {

      // if we used the phone for anything
      // we should have a yellr.TMP --> use FileTransfer
      // if we don't, we're submitting a text post --? use regular AJAX

      var forms = document.querySelectorAll('#form-wrapper form');
      total_forms = forms.length;
      // form_counter = 0;

      for (var i = 0; i < forms.length; i++) {
        var form = forms[i];

        if (form.className === 'text-form' || form.className === 'reply-text-form' || form.className === 'reply-survey-form') {
          console.log('ajaxSubmit');

          $(form).ajaxSubmit({
            url: yellr.URLS.upload,
            success: function (response) {
              console.log(response);
              if (response.success) {
                // add the media_id to our local array
                // form_counter++;
                media_objects.push(response.media_id);
                if (media_objects.length === forms.length) {
                  yellr.view.report.publish_post();
                }

              } else {
                yellr.utils.notify('Something went wrong with upload_media...');
              }
            }
          });
          // end ajaxSubmit
        } else {

          // prep for upload
          var ft = new FileTransfer(),
              options = new FileUploadOptions(),
              parameters = {
                client_id: yellr.UUID,
                media_type: yellr.TMP.file.type,
                media_caption: form.querySelector('textarea').value
              };

          // setup the options
          options.fileKey = 'media_file';
          options.params = parameters;

          // setup user feedback
          ft.onprogress = function uploadProgress(progress) {
            if (progress.lengthComputable) {
              // yellr.utils.notify(progress.loaded / progress.total);
              console.log(progress.loaded / progress.total);
              // loadingStatus.setPercentage(progress.loaded / progress.total);
            } else {
              // loadingStatus.increment();
            }
          };

          // parameters: fileURI, server, succes, fail, options
          ft.upload(yellr.TMP.file.uri, encodeURI(yellr.URLS.upload),
            function success(response) {
              yellr.utils.clearTmp();

              // yellr.utils.notify(response)
              // yellr.utils.notify(response.response)

              var response_object = JSON.parse(response.response);
              yellr.utils.notify('Successful upload. '+response_object.media_id);

              media_objects.push(response_object.media_id);

              if (media_objects.length === forms.length) {
                yellr.view.report.publish_post();
              }
              // clear tmp object
            },
            function fail(error) {
              // console.log('hello from: fail');
              yellr.utils.notify('fail');
              yellr.utils.notify(error.code + ' | ' + error.source + ' | ' + error.target);
            },
            options
          );

        }


// "client_id"
// "media_type"
// "media_file"
// "media_text"
// "media_caption"





      }

    }





    // this is used to a publish  post

    var publish_post = function() {

      // make sure we submitted all the forms

      // if (form_counter === total_forms) {

        // title should be either a free response or
        // Reply to: Assignment ID

        var our_data = {
          title: (assignment_id) ? 'Response to: Assignment '+assignment_id : 'Free Post',
          client_id: yellr.UUID,
          assignment_id: assignment_id,
          language_code: yellr.SETTINGS.language.code,
          lat: yellr.SETTINGS.lat,
          lng: yellr.SETTINGS.lng,
          media_objects: JSON.stringify(media_objects)
        };

        // console.log(our_data);
        // debugger;

        $.post(yellr.URLS.post, our_data, function(e) {
          media_objects = [];
          form_counter = 0;
          total_forms = 0;
        }).done(function () {
          console.log('post published');
        });
      // }

    }








    return {
      publish_post: publish_post,
      render: render,
      setup_form: setup_form,
      setup_extra_media: setup_extra_media,
      submit_form: submit_form
    }
})();
