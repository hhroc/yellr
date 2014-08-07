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

      // on the submission forms we can add multiple files
      // this listener handles clicks
      $('#add-extra-media').on('tap', function(e) {
        console.log(
          'target: ', e.target,
          'parent: ', e.target.parentNode
          );
      })


      this.setup_form();

    }




    var setup_form = function() {
      console.log('setting up form');


      $('#submit-btn').on('tap', this.submit_form);

      // add client_id values
      var forms = document.querySelectorAll('.submit-form');
      for (var i = 0; i < forms.length; i++) {
        forms[i].onchange = function(e) {
          // add class 'target' (do it only once)
          if (this.className.split('target').length === 1) this.className += ' target';
        }
        forms[i].querySelector('.client_id').value = yellr.UUID;
      }



      // alert('form setup');
      $('#imageUploadForm').on('submit', function(e) {
        e.preventDefault();

        // alert('submitting...');
        var formData = new FormData(this);
        console.log(formData);
        // alert(formData);

        $.ajax({
          type:'POST',
          url: $(this).attr('action'),
          data:formData,
          cache:false,
          contentType: false,
          processData: false,
          success:function(data){
            console.log("success");
            console.log(data);
            // alert('you are winner ahaha');
          },
          error: function(data){
            console.log("error");
            console.log(data);
            // alert('YOU LOSE');
          }
        });
      });

    }




    var submit_form = function() {


      // get active forms
      // var forms = document.querySelectorAll('.submit-form.target');
      // console.log(forms);

      var $form = $('#form-wrapper form');
      var $form2 = $('.target');
      var form3 = document.querySelector('.target');

      console.log('only grab the form that has been changed', $form, $form2, form3);


      /* mycodespace URLs */
      // var media_url = 'http://yellr.mycodespace.net/upload_media.json';
      // var post_url = 'http://yellr.mycodespace.net/publish_post.json';

      /* yellrdev.wxxi.org URLs */
      var media_url = 'http://yellrdev.wxxi.org/upload_media.json';
      var post_url = 'http://yellrdev.wxxi.org/publish_post.json';


      $.post(media_url, $form.serialize(), function(response){
        // we posted media to the server
        // we get a response back
        // the response has a media_object_id
        // console.log(response);
        // alert(response);

        // post the
        $.post(post_url, {
          client_id: yellr.localStorage.client_id,
          assignment_id: null,
          language_code: 'en',
          location: JSON.stringify({
            lat: 44,
            lng: -77
          }),
          media_objects: JSON.stringify([
            response.media_id
          ])
        }, function(e) {
          console.log(e);
          // alert(e);
        });
      });



    }



    return {
      render: render,
      setup_form: setup_form,
      submit_form: submit_form
    }
})();
