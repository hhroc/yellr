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
      console.log(assignment_id);
      this.setup_form(data);
      this.setup_extra_media(data);

    }








    var setup_form = function(data, append) {
      console.log('setting up ' +data.id+ ' form');

      // set up things for Handlebars
      var form = {
        template: '#'+data.id+'-form',
        context: {client_id: yellr.UUID}
      }
        // append: true

      // are we replying to an assignment?
      if (data.raw[2]) {

        // grab the ID from the URL
        form.context.assignment_id = data.raw[2];

        if (data.id === 'reply-survey') {
          var test = yellr.DATA.assignments.filter(function(val, i, arr) {
            if (val.id === parseInt(data.raw[2])) return true;
          });
          // console.log(test);
          form.context.answers = test[0].answers;
        }
      }


      if (append) $('#form-wrapper').append(render_template(form));
      else {
        form.target = '#form-wrapper';
        render_template(form);
      }
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




    /* mycodespace URLs */
    var mycodespace = {
      media_url: 'http://yellr.mycodespace.net/upload_media.json',
      post_url: 'http://yellr.mycodespace.net/publish_post.json'
    }

    /* yellrdev.wxxi.org URLs */
    var wxxi = {
      media_url: 'http://yellrdev.wxxi.org/upload_media.json',
      post_url: 'http://yellrdev.wxxi.org/publish_post.json'
    }

    var urls;

    var form_counter = 0;
    var total_forms = 0;




    var submit_form = function() {

      urls = wxxi;

      var forms = document.querySelector('#form-wrapper').querySelectorAll('form');
      total_forms = forms.length;

      for (var i = 0; i < forms.length; i++) {
        var form = forms[i];

        console.log('submitting form #'+(i+1)+' of '+forms.length);
        $(form).ajaxSubmit({
          url: urls.media_url,
          success: function (response) {
            if (response.success) {
              yellr.view.report.publish_post(response);
            } else {
              console.log('something went wrong with upload_media......');
              console.log(response);
            }
          }
        });
      }

    }





    // this is used to a publish  post
    var media_objects = [];

    var publish_post = function(server_response) {

      form_counter++;
      media_objects.push(server_response.media_id);


      if (form_counter === total_forms) {

        console.log('all forms submitted');
        console.log('assignment_id: ' + assignment_id);

        var our_data = {
          title: 'Conquest',
          client_id: yellr.UUID,
          assignment_id: assignment_id,
          language_code: yellr.SETTINGS.language.code,
          location: JSON.stringify({
            lat: 44,
            lng: -77
          }),
          media_objects: JSON.stringify(media_objects)
        };
        console.log(our_data);

        $.post(urls.post_url, our_data, function(e) {
          console.log(media_objects);
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
