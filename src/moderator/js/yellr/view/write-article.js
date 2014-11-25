'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

yellr.view.write_article = function () {


  // load collection if a URL hash is present
  // var collection_id = parseInt(window.location.hash.split('#')[1]);
  var collection_id = window.location.hash.split('#')[1];

  // make sure it's a valid number
  //    wtf. this makes no sense
  //    it keeps saying '#wefsd' is a number
  //
  //    if (collection_id !== NaN) {}
  //    if (typeof collection_id === 'number') {}
  //
  //    the url hash is a string to start
  //      so we check if it's undefined
  //      before we parse it into an int
  // ----------------------------

  if (collection_id !== undefined) {

    collection_id = parseInt(collection_id);

    yellr.server.get_collection(collection_id, function (response) {
      // render the assignment's collection for the editor
      yellr.utils.render_template({
        template: '#collections-li-template',
        target: '#write-article-collection-list',
        context: {
          collection: response.collection
        }
      });

    })

  } else {
    yellr.utils.render_template({
      template: '#collections-li-template',
      target: '#write-article-collection-list',
      context: {
        collection: undefined
      }
    });
  }



  // populate the Collections <select> with user's collections
  yellr.server.get_my_collections(function () {
    var collections = yellr.DATA.collections;
    collections.unshift({collection_id: '', name: '--'});

    yellr.utils.render_template({
      template: '#collections-option-template',
      target: '#collection-select',
      context: {
        collections: collections
      }
    })
  });

  // event listener:
  // onchange load a new collection
  document.querySelector('#collection-select').onchange = function (event) {
    if (this.value !== '') {

      yellr.server.get_collection(parseInt(this.value), function (response) {
        // render the assignment's collection for the editor
        yellr.utils.render_template({
          template: '#collections-li-template',
          target: '#write-article-collection-list',
          context: {
            collection: response.collection
          }
        });
        document.querySelector('#collection-name').innerHTML = response.collection_name;
      });

    }

  }





  document.querySelector('#post-btn').onclick = function (event) {
    // post the article
    // ===================================
    var article_data = {},
        title = document.querySelector('#article-title'),
        tags = document.querySelector('#article-tags'),
        body = document.querySelector('#article-body'),
        leadin = document.querySelector('#article-leadin');

    article_data.title = title.value;
    article_data.banner_media_id = '';
    article_data.tags = tags.value;
    article_data.contents = body.value;
    article_data.top_text = leadin.value;
    article_data.language_code = 'en';
    article_data.top_left_lat = 43.4;
    article_data.top_left_lng = -77.9;
    article_data.bottom_right_lat = 43.0;
    article_data.bottom_right_lng = -77.3;

    yellr.server.publish_story(article_data, function (response) {
      // clear old values
      title.value = '';
      tags.value = '';
      tags.value = '';
      body.value = '';
      leadin.value = '';

      // open the article in the new page
      var url = '/story?id='+response.story_unique_id;
      window.open(url, '_blank');
      alert('Article has been posted! \n'+url);
      yellr.utils.notify('Article has been posted! \n'+url);
    });
  }


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
