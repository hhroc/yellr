'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


/*
  we have 3 submit form functions. no
 */




yellr.view.report = (function() {

    /**
     * the user report page for yellr
     */

    var render_template = yellr.utils.render_template,
        form_counter = 0,
        total_forms = 0,
        media_objects = [],
        assignment_id,
        header,
        footer;



    var render = function(data) {

      /**
       * get the hash (single or feed view?)
       */


      header = data.template.header;
      header.template = '#submit-header';
      render_template(header);
      $('#submit-btn').on('tap', this.submit_form);

      yellr.utils.no_subnav();

      footer = data.template.footer;
      footer.template = '';
      render_template(footer);



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


      if (append) form.append = true;

      render_template(form);
    }








    var setup_extra_media = function (data) {

      var self = this;

      // add extra media bar
      render_template({
        template: '#extra-media',
        target: '#extra-media-wrapper'
      });


      // on the submission forms we can add multiple files
      // this listener handles clicks
      $('#extra-media-wrapper div.flex').on('tap', function(e) {
        if (e.target.nodeName === 'I' || e.target.nodeName === 'DIV') {
          var form_type = (e.target.nodeName === 'I') ? e.target.parentNode.className : e.target.className;
          data.id = form_type.split('add-')[1].split(' ')[0];
          self.setup_form(data, true);
        }
      });

    }








    var submit_form = function() {


      var forms = document.querySelector('#form-wrapper').querySelectorAll('form');
      total_forms = forms.length;

      for (var i = 0; i < forms.length; i++) {
        var form = forms[i];

        console.log('submitting form #'+(i+1)+' of '+forms.length);

        $(form).ajaxSubmit({
          url: yellr.URLS.upload,
          success: function (response) {
            if (response.success) {
              yellr.view.report.publish_post(response);
            } else {
              yellr.utils.notify('Something went wrong with upload_media...');
              console.log(response);
            }
          }
        });
      }

    }





    // this is used to a publish  post

    var publish_post = function(server_response) {

      form_counter++;
      media_objects.push(server_response.media_id);
      console.log(media_objects);

      if (form_counter === total_forms) {

        console.log('all forms submitted');

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
          console.log('post published');
        });
      }

    }








    return {
      publish_post: publish_post,
      render: render,
      setup_form: setup_form,
      setup_extra_media: setup_extra_media,
      submit_form: submit_form
    }
})();
