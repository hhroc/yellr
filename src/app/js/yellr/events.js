'use strict';
var yellr = yellr || {};

/**
 * events.js
 * ===================================
 * the eventListeners for yellr
 *
 * most of these are added via setup.js
 * they are for elements that have been rendered from templates (yellr.utils.render_template)
 * the DOM elemnts they reference only exist after they've been created
 */

yellr.events = {

  homepage: function(options) {

    // update nav
    // ----------------------------
    // clear class of other nav-option
    $('#homepage-subnav .current').removeClass('current');

    // find the new nav div
    var navTarget;
    if (options.target) navTarget = (options.target.localName === 'a') ? options.target.parentNode : options.target;
    else {
      if (options.pageID === '#news-feed') navTarget = '#news-feed-tab';
      if (options.pageID === '#assignments') navTarget = '#assignments-tab';
    }

    // update class
    var $target = $(navTarget);
    $target.addClass('current');


    // update content // page transition
    // ----------------------------
    // get data-attrs
    var page = $target.attr('data-page');
    var currentPage = $('.pt-page-current').attr('id');

    // prevent transitioning to same page
    if (page !== '#'+currentPage) {
      // move to left from right
      if (currentPage === 'assignments') yellr.pageManager.nextPage(page, 1);
      // move to right from left
      if (currentPage === 'news-feed') yellr.pageManager.nextPage(page, 2);
    }

  },

  more_options: function(e) {
    // toggle class="hidden", set attribute
    var moreList = document.querySelector('.more-options-list');

    if (moreList.getAttribute('data-hidden') === 'true') {
      moreList.className = moreList.className.split(' hidden')[0];
      moreList.setAttribute('data-hidden', 'false');
    } else {
      moreList.className += ' hidden';
      moreList.setAttribute('data-hidden', 'true');
    }
  },

  report_details: function(e) {
    // the element holding the extra info
    var container = document.querySelector('#submit-footer .more-info');
    // current info showin
    var current = container.getAttribute('data-current');
    // what was just selected
    var selected = e.target.getAttribute('data-info') || e.target.parentNode.getAttribute('data-info');
    console.log(current, selected);

    // show the thing
    if (current === 'none') {
      container.className = container.className.split(' hidden')[0];
    }


    var target;
    var extras = document.querySelectorAll('.extra-info');
    for (var i = 0; i < extras.length; i++) {
      // clear selected classname
      extras[i].className = extras[i].className.split('selected')[0];
      // find our target
      if (extras[i].getAttribute('data-info') == selected)
        target = extras[i];
    }
    console.log(target);
    target.className += ' selected';
    container.setAttribute('data-current', selected);

    // if (selected === current) {
    //  container.className += ' hidden';
    // }

    // close it if we have a toggle
    if (selected === current) {
      container.className += ' hidden';
      container.setAttribute('data-current', 'none');
    }

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
  },


  submit_form: function(e) {


    // get active forms
    // var forms = document.querySelectorAll('.submit-form.target');
    // console.log(forms);


    var $form = $('#form-wrapper form');
    var $form2 = $('.target');
    var form3 = document.querySelector('.target');

    console.log('only grab the form that has been changed', $form, $form2, form3);

    // /* yellrdev.wxxi.org URLs */
    var media_url = 'http://yellrdev.wxxi.org/upload_media.json';
    var post_url = 'http://yellrdev.wxxi.org/publish_post.json';


    // $('#imageUploadForm').on('submit',(function(e) {
    //     e.preventDefault();
    //     var formData = new FormData(this);

    //     $.ajax({
    //         type:'POST',
    //         url: $(this).attr('action'),
    //         data:formData,
    //         cache:false,
    //         contentType: false,
    //         processData: false,
    //         success:function(data){
    //           console.log("success");
    //           console.log(data);
    //         },
    //         error: function(data){
    //           console.log("error");
    //           console.log(data);
    //         }
    //     });
    // }));

    // $("#ImageBrowse").on("change", function() {
    //     $("#imageUploadForm").submit();
    // });






    // console.log($form.serialize());


    // // Initialize the jQuery File Upload plugin
    // // $('#upload').fileupload({
    // $form.fileupload({

    //   // This element will accept file drag/drop uploading
    //   dropZone: $('#form-wrapper'),

    //   // This function is called when a file is added to the queue;
    //   // either via the browse button, or via drag/drop:
    //   add: function (e, data) {

    //     // var tpl = $('<li class="working"><input type="text" value="0" data-width="48" data-height="48"'+
    //     //     ' data-fgColor="#0788a5" data-readOnly="1" data-bgColor="#3e4043" /><p></p><span></span></li>');

    //     // // Append the file name and file size
    //     // tpl.find('p').text(data.files[0].name)
    //     //              .append('<i>' + formatFileSize(data.files[0].size) + '</i>');

    //     // // Add the HTML to the UL element
    //     // data.context = tpl.appendTo(ul);

    //     // // Initialize the knob plugin
    //     // tpl.find('input').knob();

    //     // // Listen for clicks on the cancel icon
    //     // tpl.find('span').click(function(){

    //     //   if(tpl.hasClass('working')){
    //     //     jqXHR.abort();
    //     //   }

    //     //   tpl.fadeOut(function(){
    //     //     tpl.remove();
    //     //   });

    //     // });

    //     console.log('added new file..');
    //     // Automatically upload the file once it is added to the queue
    //     var jqXHR = data.submit();
    //   },

    //   progress: function(e, data){

    //     // Calculate the completion percentage of the upload
    //     var progress = parseInt(data.loaded / data.total * 100, 10);
    //     console.log(progress);

    //     // // Update the hidden input field and trigger a change
    //     // // so that the jQuery knob plugin knows to update the dial
    //     // data.context.find('input').val(progress).change();

    //     // if(progress == 100){
    //     //   data.context.removeClass('working');
    //     // }
    //   },

    //   fail:function(e, data){
    //     // Something has gone wrong!
    //     alert('something went wrong with the file upload');
    //     // data.context.addClass('error');
    //   }
    // });






    // $.ajax({
    //   url: media_url,
    //   type: 'POST',
    //   crossDomain: true,
    //   contentType: 'multipart/form-data',
    //   dataType: 'json',
    //   data: $form.serialize(),
    //   // headers: {

    //   // },
    //   beforeSend: function(xhr, settings) {
    //     console.log('hello from beforeSend');
    //     xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    //   },
    //   complete: function(xhr, status) {
    //     console.log('hello from: complete');
    //     console.log(xhr, status);
    //   },
    //   error: function(xhr, status, err) {
    //     console.log('hello from: error');
    //     console.log(xhr, status, err);
    //   },
    //   success: function(data, status, xhr) {
    //     console.log('hello from: success');
    //     console.log(data, status, xhr);
    //   }
    // });


    // console.log('posting...');
    // // console.log('title', $form.serialize().split('title=')[1].split('&')[0]);
    // $.post(media_url, $form.serialize(), function(response){
    //   // we posted media to the server
    //   // we get a response back
    //   // the response has a media_object_id
    //   console.dir(response);
    //   // alert(response);

    //   // post the
    //   $.post(post_url,
    //     { client_id: yellr.localStorage.client_id,
    //       assignment_id: null,
    //       language_code: 'en',
    //       location: JSON.stringify({
    //         lat: 44,
    //         lng: -77
    //       }),
    //       // title:
    //       media_objects: JSON.stringify([
    //         response.media_id
    //       ])
    //     },
    //     function(e) {
    //       console.dir(e);
    //       // alert(e);
    //       yellr.events.notify(e);
    //       yellr.events.clearForm();
    //     }
    //   );
    // });

    // ===================================

    // var $form = $('#form-wrapper form');
    // console.log($form.attr('action'), $form.serialize());

    // /* mycodespace URLs */
    // // var media_url = 'http://yellr.mycodespace.net/upload_media.json';
    // // var post_url = 'http://yellr.mycodespace.net/publish_post.json';

    // /* yellrdev.wxxi.org URLs */
    // var media_url = 'http://yellrdev.wxxi.org/upload_media.json';
    // var post_url = 'http://yellrdev.wxxi.org/publish_post.json';

    // alert('post some media');
    // alert(media_url);
    // alert($form.serialize());

    // $.post(media_url, $form.serialize(), function(response){
    //   // we posted media to the server
    //   // we get a response back
    //   // the response has a media_object_id
    //   // console.log(response);
    //   alert(response);

    //   // post the
    //   $.post(post_url, {
    //     client_id: yellr.localStorage.client_id,
    //     assignment_id: null,
    //     language_code: 'en',
    //     location: JSON.stringify({
    //       lat: 44,
    //       lng: -77
    //     }),
    //     media_objects: JSON.stringify([
    //       response.media_id
    //     ])
    //   }, function(e) {
    //     console.log(e);
    //     // alert(e);
    //   });
    // });



  }
}
