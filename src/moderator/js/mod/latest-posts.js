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


        // // make sure we have data
        // if (yellr.DATA.assignments === undefined) {
        //   wait_for_data(yellr.view.assignments.render_feed, yellr.utils.load('assignments'));
        //   return;
        // }


      }
      else this.render();

      $('#refresh-posts').on('click', function (e) {
        mod.utils.load('posts');
        mod.latest_posts.render();
      });
    }



    var render = function () {
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



      // Send a message to a user who submitted content
      var msg_btn = document.querySelector('.submissions-grid');
      msg_btn.onclick = function(e) {
        if (e.target.className === 'fa fa-comment') {
          var uid = e.target.offsetParent.querySelector('.meta-div').getAttribute('data-uid')
          console.log(uid);
          mod.messages.create_message(uid);
        }
      };



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
      render: render
    }
})();
