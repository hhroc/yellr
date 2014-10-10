'use strict';
var mod = mod || {};

mod.editor = (function() {

  var init = function () {
    // get the collection for the assignment
    mod.collections.get_collection(parseInt(window.location.hash.split('#')[1]), function (collection) {      console.log('hello from: ');

      // render the assignment's collection for the editor
      mod.utils.render_template({
        template: '#collections-li-template',
        target: '#editor-collections-list',
        context: {
          collection: collection
        }
      });


    });


    function Editor(input, preview) {
      this.update = function () {
        var title = '# ' + $('#article-title').val() + '\n';
        preview.innerHTML = markdown.toHTML(title + input.value);
      };
      input.editor = this;
      this.update();
    }

    var editor = new Editor(document.getElementById("markdown-editor"), document.getElementById("editor-preview"));


    // setup event listeners
    $('#preview-btn').on('click', function (e) {

      var $editor = $('#editor-workspace .editor-container');
      var new_inactive = $editor.find('.active');
      var new_active = $editor.find('.inactive');
      new_inactive.removeClass('active').addClass('inactive');
      new_active.removeClass('inactive').addClass('active');
      editor.update();
    });


    $('#editor-controls .submit-btn').on('click', function (e) {

      $.post(mod.URLS.publish_story, {
        title: $('#article-title').val(),
        tags: 'test, 1, 2, 3',
        top_text: $('#top-text').val(),
        banner_media_id: '',
        // banner_media_id: '329af2ee-6014-4a90-a7c3-05dba003c7ac',
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
