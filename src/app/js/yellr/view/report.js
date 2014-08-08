'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.report = (function() {

    /**
     * the user report page for yellr
     */

    var render_template = yellr.utils.render_template;
    var header, footer;



    var render = function(data) {

      /**
       * get the hash (single or feed view?)
       */


      header = data.template.header;
      header.template = '#submit-header';
      footer = data.template.footer;
      footer.template = '';

      render_template(header);
      render_template(footer);
      yellr.utils.no_subnav();
      $('#submit-btn').on('tap', this.submit_form);



      this.setup_form(data.id);



      // add extra media bar
      render_template({
        template: '#extra-media',
        target: '#extra-media-wrapper'
      });


      // on the submission forms we can add multiple files
      // this listener handles clicks
      $('#extra-media-wrapper').on('tap', function(e) {
        console.log(
          'target: ', e.target,
          'parent: ', e.target.parentNode
        );
      });

    }






    var render_template = yellr.utils.render_template;


    var setup_form = function(type, append) {
      console.log('setting up ' +type+ ' form');

      if (append) $('#form-wrapper').append(render_template({template: '#'+type+'-form', context: {client_id: yellr.UUID } }));
      else $('#form-wrapper').html(render_template({template: '#'+type+'-form', context: {client_id: yellr.UUID } }));

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
      console.log('forms to submit: ', forms);
      total_forms = forms.length;

      for (var i = 0; i < forms.length; i++) {
        var form = forms[i];

        // post each form
        // $(form).ajaxForm(function(response) {
        //   // alert('did that shit work?');
        //   alert('image posted');
        //   console.log('successful post!', response);
        //   console.log(this);
        //   console.log('call a function, pass the media_id');
        //   yellr.view.report.publish_post(response);
        // });

        $.post(urls.media_url, $(form).serialize(), function(response) {
          console.log('successful post');
          yellr.view.report.publish_post(response);
        })
      };


      // $('#imageUploadForm').ajaxForm(function(response) {
      //   // alert('did that shit work?');
      //   alert('image posted');
      //   console.log('image posted');
      //   console.log(response);
      // });

    }


    // this is used to a publish  post
    var media_objects = [];

    var publish_post = function(server_response) {
      console.log('count how many times weve been pinged','when number equals length of forms submitted, publish post');

      console.log(server_response);
      media_objects.push(server_response.media_id);
      form_counter++;

      $.post(urls.post_url, {
        title: 'test',
        client_id: yellr.UUID,
        assignment_id: null,
        language_code: 'en',
        location: JSON.stringify({
          lat: 44,
          lng: -77
        }),
        media_objects: JSON.stringify([
          server_response.media_id
        ])
      }, function(e) {
        console.log(e);
        // alert(e);
      });

      // if (form_counter >= total_forms) {
      //   console.log('we have submitted all the forms');
      //   console.log(media_objects);

      //   $.post(urls.post_url, {
      //     title: 'test',
      //     client_id: yellr.UUID,
      //     assignment_id: null,
      //     language_code: 'en',
      //     location: JSON.stringify({
      //       lat: 44,
      //       lng: -77
      //     }),
      //     media_objects: JSON.stringify(media_objects)
      //   }, function(e) {
      //     console.log('post published');
      //     console.log(e);
      //     // alert(e);
      //   });

      // };



      // $.post(post_url, {
      //   client_id: yellr.UUID,
      //   assignment_id: null,
      //   language_code: 'en',
      //   location: JSON.stringify({
      //     lat: 44,
      //     lng: -77
      //   }),
      //   media_objects: JSON.stringify([
      //     response.media_id
      //   ])
      // }, function(e) {
      //   console.log(e);
      //   // alert(e);
      // });

    // <input id="client_id" name="client_id" type="text" value="{0}">
    // <input id="assignment_id" name="assignment_id" type="text" value="{0}">
    // <input id="language_code" name="language_code" type="text" value="en">
    // <input id="location" name="location" type="text" value="{'lat': 44, 'lng': -77}">
    // <input id="media_objects" name="media_objects" type="text" value="{'<uuid>','<uuid>', etc.}">

    }



    return {
      publish_post: publish_post,
      render: render,
      setup_form: setup_form,
      submit_form: submit_form
    }
})();
