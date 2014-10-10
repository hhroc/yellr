'use strict';
var mod = mod || {};

mod.feed =  {

  toggle_collections_dropdown: function (target) {

    if ($(target.parentNode).hasClass('dropdown-container'))
      mod.feed.hide_collections_dropdown(target);
    else mod.feed.show_collections_dropdown(target);

  },



  show_collections_dropdown: function (target) {
    // we are here --> <i class="fa fa-thing"></i>
    // we want the parent <li> to start


    $(target.parentNode).addClass('dropdown-container');

    mod.utils.render_template({
      template: '#collections-dropdown-template',
      target: target.parentNode,
      context: {collections: mod.DATA.collections},
      append: true
    });

    $(target.parentNode).find('.collections-dropdown').on('click', function (e) {
      mod.feed.add_post_to_collection_from_feed(e.target)
    })
  },



  hide_collections_dropdown: function (target) {

    $(target.parentNode).removeClass('dropdown-container');

    mod.utils.render_template({
      template: '',
      target: $(target.parentNode).find('.collections-dropdown')
    });
  },



  add_post_to_collection_from_feed: function (target) {

    // we're in pretty deep with the DOM, need to get out
    var $gi = $(target.offsetParent.offsetParent.parentNode.parentNode.parentNode),
        post_id = $gi.find('.meta-div').data('post-id'),
        collection_id = $(target).data('collection-id');

    mod.collections.add_post_to_collection(post_id, collection_id, function (result) {
      if (result) {
        // this is a quick hack
        // should use a CSS class instead
        target.parentNode.style.opacity = '0.3';
        // target.parentNode.className = 'faded';
      };
    });

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

};
