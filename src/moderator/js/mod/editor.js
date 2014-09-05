'use strict';
var mod = mod || {};

mod.editor = (function() {

  var init = function () {


    $('#preview-btn').on('click', function (e) {

      var $editor = $('#editor-workspace .editor-container');
      var new_inactive = $editor.find('.active');
      var new_active = $editor.find('.inactive');
      new_inactive.removeClass('active').addClass('inactive');
      new_active.removeClass('inactive').addClass('active');

    });


    $('#editor-controls .submit-btn').on('click', function (e) {

      $.post(mod.URLS.publish_story, {
        title: $('#article-title').val(),
        tags: 'test, 1, 2, 3',
        top_text: 'top text',
        banner_media_id: '329af2ee-6014-4a90-a7c3-05dba003c7ac',
        contents: $('#markdown-editor').val(),
        language_code: 'en',
        top_left_lat: 43.4,
        top_left_lng: -77.9,
        bottom_right_lat: 43.0,
        bottom_right_lng: -77.3
      },
      function (response) {
        if (response.success) {
          console.log('post successful!');
        } else {
          console.log('something went wrong');
        }
        console.log(response);
      });

    });
  }

  return {
    init: init
  }
})();
