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

  submit_form: function(e) {


    // get active forms
    // var forms = document.querySelectorAll('.submit-form.target');
    // console.log(forms);



    var $form = $('#form-wrapper form');


    /* yellrdev.wxxi.org URLs */
    var media_url = 'http://yellrdev.wxxi.org/upload_media.json';
    var post_url = 'http://yellrdev.wxxi.org/publish_post.json';

    console.log($form.serialize());

    console.log('posting...');
    $.post(media_url, $form.serialize(), function(response){
      // we posted media to the server
      // we get a response back
      // the response has a media_object_id
      console.dir(response);
      alert(response);

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
        console.dir(e);
        alert(e);
      });
    });



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
