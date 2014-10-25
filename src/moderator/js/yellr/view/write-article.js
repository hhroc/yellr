'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

yellr.view.write_article = function () {

  var settings = {
    title: '',
    body: '',
    top_text: '',
    top_left_lat: 0,
    top_left_lng: 0,
    bottom_right_lat: 0,
    bottom_right_lng: 0,
    collection: 3
  }

  // // get the collection for the assignment
  // mod.collections.get_collection(parseInt(window.location.hash.split('#')[1]), function (response) {

  //   // render the assignment's collection for the editor
  //   mod.utils.render_template({
  //     template: '#collections-li-template',
  //     target: '#write-article-collection-list',
  //     context: {
  //       collection: response.collection
  //     }
  //   });

  // });


  // function Editor(input, preview) {
  //   this.update = function () {
  //     var title = '# ' + $('#article-title').val() + '\n';
  //     preview.innerHTML = markdown.toHTML(title + input.value);
  //   };
  //   input.editor = this;
  //   this.update();
  // }

  // var editor = new Editor(document.getElementById("markdown-editor"), document.getElementById("editor-preview"));


  // // setup event listeners
  // $('#preview-btn').on('click', function (e) {

  //   var $editor = $('#editor-workspace .editor-container');
  //   var new_inactive = $editor.find('.active');
  //   var new_active = $editor.find('.inactive');
  //   new_inactive.removeClass('active').addClass('inactive');
  //   new_active.removeClass('inactive').addClass('active');
  //   editor.update();
  // });


  // $('#editor-controls .submit-btn').on('click', function (e) {

  //   $.post(mod.URLS.publish_story, {
  //     title: $('#article-title').val(),
  //     tags: 'test, 1, 2, 3',
  //     top_text: $('#top-text').val(),
  //     banner_media_id: '',
  //     // banner_media_id: '329af2ee-6014-4a90-a7c3-05dba003c7ac',
  //     contents: $('#markdown-editor').val(),
  //     language_code: 'en',
  //     top_left_lat: 43.4,
  //     top_left_lng: -77.9,
  //     bottom_right_lat: 43.0,
  //     bottom_right_lng: -77.3
  //   },
  //   function (response) {
  //     if (response.success) {
  //       console.log('post successful!');
  //     } else {
  //       console.log('something went wrong');
  //     }
  //     console.log(response);
  //   });

  // });


  document.querySelector('#article-body').ondrop = function (event) {
    console.log(event);
    // console.log('hello from: ');
    var data = event.dataTransfer.getData('text/x-media');
    // var data = event.dataTransfer.getData('media');
    console.log(data);
    // var data = event.dataTransfer.getData(internalDNDType);
  }
  // document.querySelector('#article-body').setAttribute('dropzone', 'move string:media');
// dropzone="move string:text/x-example"


  // var collection_li = document.querySelectorAll('#write-article-collection-list li');
  document.querySelector('#write-article-collection-list').ondragstart = function (event) {
    console.log('dragstart');
    // console.log(event.target);
    console.log(event.target.dataset.media);
    // event.dataTransfer.setData('media', event.target.dataset.media);
    // event.dataTransfer.setData('text/x-media', event.target.dataset.value);
    // event.dataTransfer.setData(internalDNDType, event.target.dataset.value);
    // event.dataTransfer.effectAllowed = 'move';
    // event.dataTransfer.effectAllowed = 'move';
  };
  // for (var i = 0; i < collection_li.length; i++) {
  //   collection_li[i].ondragstart = function (event) {
  //     // console.log(event);
  //     // console.log(event.target);
  //     console.log(event.target.dataset.media);
  //     event.dataTransfer.setData('media', event.target.dataset.media);
  //     event.dataTransfer.setData('text/x-media', event.target.dataset.value);
  //     // event.dataTransfer.setData(internalDNDType, event.target.dataset.value);
  //     // event.dataTransfer.effectAllowed = 'move';
  //     // event.dataTransfer.effectAllowed = 'move';
  //   }
  // };



  // // drag and drop an item onto the collections nav link
  // var drop_target = document.querySelector('#article-body');
  // drop_target.ondragover = function(e) {
  //   // moderator.allowDrop(e);
  //   e.preventDefault();
  //   // console.log(e);
  //   // console.log(this);
  //   this.style.background = 'tomato';
  // }
  // drop_target.ondragleave = function(e) {
  //   e.preventDefault();
  //   this.style.background = 'transparent';
  // }
  // drop_target.ondrop = function(e) {
  //   e.preventDefault();
  //   this.style.background = 'blue';
  //   console.log(e.dataTransfer);
  //   // console.log('story id: ', e.dataTransfer.getData('story_id'));
  // }




};
