'use strict';
var mod = mod || {};

mod.latest_posts = (function() {

    /**
     * This object renders the Posts feed
     * ie all the posts that users have submitted
     */


    var init = function () {

      // make sure we have data
      if (mod.DATA.posts === undefined) {
        console.log('show loading gif. tell them we\'re loading data');
        mod.utils.load('posts');
        var wait = setTimeout(mod.latest_posts.init, 1000);
      }
      else {
        this.render_feed();

        // Send a message to a user who submitted content
        var msg_btn = document.querySelector('.submissions-grid');
        msg_btn.onclick = function(e) {
          switch (e.target.className) {
            case 'fa fa-folder':
              mod.latest_posts.toggle_collections_dropdown(e.target);
              break;
            case 'fa fa-comment':
              var uid = e.target.offsetParent.querySelector('.meta-div').getAttribute('data-uid')
              mod.messages.create_message(uid, 'RE: Recent post on Yellr');
              break;
            case 'fa fa-flag':
              console.log('report the motherfucker');
              break;
            default:
              break;
          }
        };

        $('#refresh-posts').on('click', function (e) {
          mod.utils.load('posts');
          mod.latest_posts.render_feed();
        });

      }
      // end if..else

    }




    var toggle_collections_dropdown = function (target) {

      if ($(target.parentNode).hasClass('dropdown-container'))
        mod.latest_posts.hide_collections_dropdown(target);
      else mod.latest_posts.show_collections_dropdown(target);

    }



    var show_collections_dropdown = function (target) {
      // we are here --> <i class="fa fa-thing"></i>
      // we want the parent <li> to start

      mod.DATA.collections = [
        {title: 'Do you think that schools should move their start time to later?', id: 0 },
        {title: 'We\'ve got to get something to eat and to drink yeah.', id: 1 },
        {title: 'Let\'s go get a bottle', id: 2 }
      ];

      $(target.parentNode).addClass('dropdown-container');

      mod.utils.render_template({
        template: '#collections-dropdown-template',
        target: target.parentNode,
        context: {collections: mod.DATA.collections},
        append: true
      });

      $(target.parentNode).find('.collections-dropdown').on('click', function (e) {
        console.log(e);
        mod.latest_posts.add_post_to_collection(e.target)
      })
    }



    var hide_collections_dropdown = function (target) {

      $(target.parentNode).removeClass('dropdown-container');

      mod.utils.render_template({
        template: '',
        target: $(target.parentNode).find('.collections-dropdown')
      });
    }



    var add_post_to_collection = function (target) {
      console.log('add post to collection');
      // we're in pretty deep with the DOM, need to get out
      // console.dir(target);
      // console.log(target.offsetParent.offsetParent.parentNode.parentNode.parentNode);
      // var $collection = $(target).data('collection-id');
      // console.log($collection);
      var $gi = $(target.offsetParent.offsetParent.parentNode.parentNode.parentNode);
      // console.log($gi);

      console.log({
        post_id: $gi.find('.meta-div').data('post-id'),
        collection_id: $(target).data('collection-id')
      });

      $.post(mod.URLS.add_post_to_collection, {
        post_id: $gi.find('.meta-div').data('post-id'),
        collection_id: $(target).data('collection-id')
      }, function (response) {
        if (response.success) {
          // mod.latest_posts.hide_collections_dropdown();
          console.log('added post to collection');
        } else {
          console.log('something went wrong adding the post to the collection');
        }
      })

    }




    var render_feed = function () {
      console.log('hello from: render');

      mod.utils.render_template({
        template: '#latest-posts-template',
        target: '#latest-posts',
        context: {
          posts: mod.DATA.posts
        }
      });


      // // set up the grid magic with packery
      // var container = document.querySelector('#latest-posts');
      // // var pckry = new Packery( container, {
      // var packery = new Packery( container, {
      //   itemSelector: '.gi',
      //   columnWidth: container.querySelector('.grid-sizer'),
      //   gutter: container.querySelector('.gutter-sizer'),
      //   isResizeBound: true,
      // });

      // var delay_packery = setTimeout(function () {
      //   packery.layout();

      //   clearTimeout(delay_packery);
      // }, 2000);





    }




    // DRAG AND DROP
    //
    // moderator.drag = function(e, element) {
    //   // console.log(e);
    //   console.log(e.dataTransfer);
    //   // e.dataTransfer.setData("Text", ev.target.id);
    // }
    // moderator.allowDrop = function(e, element) {
    //   e.preventDefault();
    //   console.log(e);
    //   console.log(this);
    //   // this.style.background = 'tomato';
    // }
    // moderator.drop = function(e, element) {
    //   ev.preventDefault();
    //   var data = ev.dataTransfer.getData("Text");
    //   ev.target.appendChild(document.getElementById(data));
    // }


    // // drag and drop an item onto the collections nav link
    // var drop_target = document.querySelector('#collections-li');
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
    //   console.log('story id: ', e.dataTransfer.getData('story_id'));
    // }




    return {
      init: init,
      render_feed: render_feed,
      show_collections_dropdown: show_collections_dropdown,
      hide_collections_dropdown: hide_collections_dropdown,
      toggle_collections_dropdown: toggle_collections_dropdown,
      add_post_to_collection: add_post_to_collection
    }
})();
