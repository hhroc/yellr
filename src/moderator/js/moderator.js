'use strict';
var moderator = moderator || {};


// functions to load demo stuff
moderator.demo = {
  loadData: function() {
    $.ajax({
      url: 'data/moderator-sample.json',
      beforeSend: function( xhr ) {
        xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
      }
    })
    .done(function( data ) {
      var json = JSON.parse(data);

      if (document.querySelector('#all-submissions')) {
        moderator.main.createGrid(json.latest_submissions, document.querySelector('.grid.submissions-grid'));
      }

    });
  },

  uid: function() {
    return Math.random().toString().split('.')[1].slice(0,8);
  }
}



moderator.packery = undefined;

moderator.drag = function(e, element) {
  // console.log(e);
  console.log(e.dataTransfer);
  // e.dataTransfer.setData("Text", ev.target.id);
}
moderator.allowDrop = function(e, element) {
  e.preventDefault();
  console.log(e);
  console.log(this);
  // this.style.background = 'tomato';
}
moderator.drop = function(e, element) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("Text");
  ev.target.appendChild(document.getElementById(data));
}




// the actual stuff
moderator.main = {
  init: function() {

    // drag and drop an item onto the collections nav link
    var drop_target = document.querySelector('#collections-li');
    drop_target.ondragover = function(e) {
      // moderator.allowDrop(e);
      e.preventDefault();
      // console.log(e);
      // console.log(this);
      this.style.background = 'tomato';
    }
    drop_target.ondragleave = function(e) {
      e.preventDefault();
      this.style.background = 'transparent';
    }
    drop_target.ondrop = function(e) {
      e.preventDefault();
      this.style.background = 'blue';
      console.log('story id: ', e.dataTransfer.getData('story_id'));
    }

    // hook up navigation tabs
    // document.querySelector('#tabs').onclick = function(e) {
    //  e.preventDefault();
    //  if (e.target.nodeName == 'A') {
    //    // update current tab
    //    document.querySelector('#current-tab').id = '';
    //    e.target.id = 'current-tab';

    //    // update tab content
    //    document.querySelector('#current-content').id = '';
    //    document.querySelector('.content[data-tab="'+e.target.getAttribute('data-tab')+'"]').id = 'current-content';
    //  }
    // };


    // // the good shit.
    // document.querySelector('#current-content').onclick = moderator.main.reject;
    // document.querySelector('#current-content').onclick = moderator.main.moderate;

    // set up the grid magic with packery
    var container = document.querySelector('.grid');
    // var pckry = new Packery( container, {
    moderator.packery = new Packery( container, {
      itemSelector: '.gi',
      columnWidth: container.querySelector('.grid-sizer'),
      gutter: container.querySelector('.gutter-sizer'),
      isResizeBound: true,
    });

    // set up content filtering
    moderator.filter.init( {grid:container});



    var msg_btn = document.querySelector('.submissions-grid');
    msg_btn.onclick = function(e) {
      // console.log('hello from: submissions_grid');
      // console.log('testing:', e.target);
      // console.dir(e.target);
      if (e.target.className === 'fa fa-comment') {
        // console.log('herro');
        // console.dir(e.target.offsetParent);
        console.log(
          e.target.offsetParent.getAttribute('data-uid')
        );
      }
    };

  },

  createGrid: function(data, target) {

    // creates this:
    /* ===================================
    <div class="gi">
      <div class="story-item">
        <div class="media-preview"><img src="http://lorempixel.com/400/200"></div>
        <p class="description">Rhinos win, Rhinos win!</p>
        <ul class="tags-list">
          <li>muse</li>
          <li>race</li>
          <li>win</li>
        </ul>
        <p class="source"><a href="#">24032422</a></p>
        <div data-source="anonymous" data-type="photo" data-uid="24032422" class="meta-div"></div>
      </div>
      <div class="options-wrapper">
        <ul class="options-list">
          <li><i title="Add a tag" class="fa fa-tag"></i></li>
          <li><i title="Add to collection" class="fa fa-folder"></i></li>
          <li><i title="Leave feedback" class="fa fa-comment"></i></li>
          <li><i title="Mark as inappropriate" class="fa fa-flag"></i></li>
        </ul>
      </div>
    </div>
    */

    var frag = document.createDocumentFragment();
    var items = [];

    for (var i = 0; i < data.length; i++) {
      // the data
      // ----------------------------
      var entry = data[i];
      var source = entry.source;
      var content = entry.content;
      // meta tag (filled as we go along)
      var meta = document.createElement('div');


      // the build
      // ----------------------------
      var gi = document.createElement('div');
          gi.setAttribute('data-uid', entry.source.UID);
          gi.className = 'gi';
          gi.setAttribute('draggable', 'true');
          gi.ondragstart = function(e) {
            this.style.opacity = '0.35';
            // moderator.drag(e, this);
            // this.document.querySelector('.meta').getAttribute('data-uid')
            // e.dataTransfer.setData('story_id', this.document.querySelector('.meta').getAttribute('data-uid'));
            e.dataTransfer.setData('story_id', 'PRESSURE, pushing down on me');
          }
          gi.ondragend = function(e) {
            this.style.opacity = '1';
          }

      var story = document.createElement('div');
          story.className = 'story-item';

      // media preview div
      var media_preview = document.createElement('div');
          media_preview.className = 'media-preview';
      var media;
          media = document.createElement('img');
          media.src = content.url;

      if (content.type === 'photo') {
        meta.setAttribute('data-type', 'photo');
      }
      if (content.type === 'video') {
        meta.setAttribute('data-type', 'video');
      }
      if (content.type === 'audio') {
        meta.setAttribute('data-type', 'audio');
      }
      if (content.type === 'text') {
        meta.setAttribute('data-type', 'text');
      }
      media_preview.appendChild(media);
      story.appendChild(media_preview);

      // description
      var description = document.createElement('p');
          description.className = 'description';
          description.innerHTML = content.description;
      story.appendChild(description);

      // tags
      var tags = document.createElement('ul');
          tags.className = 'tags-list';
      for (var j = 0; j < content.tags.length; j++) {
        var tag = document.createElement('li');
        tag.innerHTML = content.tags[j];
        tags.appendChild(tag);
      };
      story.appendChild(tags);

      // source
      var source = document.createElement('p');
          source.className = 'source';
      var source_link = document.createElement('a');
          source_link.href = '#';
          if (source.type === 'anonymous') {
            var hash = moderator.demo.uid();
            console.log(hash);
            source_link.innerHTML = hash;
            meta.setAttribute('data-source', 'anonymous');
            meta.setAttribute('data-uid', hash);
          }
          else {
            source_link.innerHTML = source.username;
            meta.setAttribute('data-source', 'validated');
            meta.setAttribute('data-uid', source.username);
          }
      source.appendChild(source_link);
      story.appendChild(source);

      // append meta tag
      story.appendChild(meta);


      var options = document.createElement('div');
          options.className = 'options-wrapper';
      var options_list = document.createElement('ul');
          options_list.className = 'options-list';
      for (var k = 0; k < 4; k++) {
        var option = document.createElement('li');
        var icon = document.createElement('i');
        icon.className = 'fa';
        if (k == 0) {
          icon.setAttribute('title', 'Add a tag');
          icon.className += ' fa-tag';
        }
        if (k == 1) {
          icon.setAttribute('title', 'Add to collection');
          icon.className += ' fa-folder';
        }
        if (k == 2) {
          icon.setAttribute('title', 'Leave feedback');
          icon.className += ' fa-comment';
        }
        if (k == 3) {
          icon.setAttribute('title', 'Mark as inappropriate');
          icon.className += ' fa-flag';
        }
        option.appendChild(icon);
        options_list.appendChild(option);
      }
      options.appendChild(options_list);


      // NOW PUT IT ALL TOGETHER
      gi.appendChild(story);
      gi.appendChild(options);
      frag.appendChild(gi);
      items.push(gi)
    }

    // we're done
    target.appendChild(frag);
    moderator.packery.appended(items);

    // some weirdness is going.
    // this is a hack solution
    setTimeout(function() {
      moderator.packery.layout();
    }, 1500);
  }


}


moderator.submissions_grid = undefined;


moderator.filter = {

  settings: {
    source_type: 'all',
    media_types: ['video', 'photo', 'audio', 'text'],
    text: ''
  },

  init: function(options) {

    // cache the grid
    moderator.submissions_grid = options.grid.querySelectorAll('.story-item');

    // setup event listeners
    var filterForm = document.querySelector('.filter-form');
        filterForm.querySelector('#filter-submission-type').onclick = this.submission_type;
        filterForm.querySelector('#filter-content-type').onclick = this.content_type;
        filterForm.querySelector('#filter-search').onkeyup = this.search;
  },

  submission_type: function(e) {
    if (e.target.tagName == 'INPUT') {
      // update settings
      moderator.filter.settings.source_type = e.target.value;
      // make call
      moderator.filter.grid({
        array: moderator.submissions_grid,
        settings: moderator.filter.settings
      });
    }
  },

  content_type: function(e) {
    if (e.target.tagName == 'INPUT') {
      // loop through other checkboxes,
      // checked values, should be shown
      var show_types = [];
      var parent = e.target.parentNode.parentNode;

      var inputs = parent.querySelectorAll('input[type="checkbox"]');
      for (var i = 0; i < inputs.length; i++) {
        var type = inputs[i];
        if (type.checked) {
          show_types.push(type.value);
        }
      }

      // update settings
      moderator.filter.settings.media_types = show_types;
      // make the call
      moderator.filter.grid({
        array: moderator.submissions_grid,
        settings: moderator.filter.settings
      });
    }
  },
  search: function(e) {
    // update settings
    moderator.filter.settings.text = e.target.value.toLowerCase();
    // make call
    moderator.filter.grid({
      array: moderator.submissions_grid,
      settings: moderator.filter.settings
    });
  },

  grid: function(config) {
    // config should have:
    // - grid: array of things
    // - settings: obj
    for (var i = 0; i < config.array.length; i++) {
      var item = config.array[i];
      var meta = item.querySelector('.meta-div');

      // clear filtered-out classname
      var classes = item.className;
      item.className = classes.split('filtered-out')[0];

      // FILTER SOURCE TYPE
      // ----------------------------
      // if value is not 'All', filter it
      if (config.settings.source_type !== 'all') {
        if (meta.getAttribute('data-source') !== config.settings.source_type) {
          item.className += ' filtered-out';
        }
      }

      // FILTER MEDIA TYPE
      // ----------------------------
      var media_type = meta.getAttribute('data-type');
      // console.log(media_type, config.settings.media_types);
      var match = false;
      for (var j = 0; j < config.settings.media_types.length; j++) {
        var type = config.settings.media_types[j];
        if (media_type == type) {
          match = true;
          break;
        }
      }
      if (!match) {
        item.className += ' filtered-out';
      }

      // FILTER BY TEXT
      // ----------------------------
      var regex = new RegExp(moderator.filter.settings.text);

      var description = item.querySelector('.description').innerHTML.toLowerCase();

      // this if statement seems backwards,
      // but that's how it works, so idk
      if (description.search(regex))
        item.className += ' filtered-out';

    } // end for...loop
    // we now know which elements to filter out

    // prep the grid
    moderator.packery.reloadItems();

    var filtered = document.querySelectorAll('.filtered-out');
    for (var j = 0; j < filtered.length; j++) {
      moderator.packery.remove(filtered[j].parentNode);
    };
    // console.log(config.array[0]);
    // console.log(moderator.packery);
    moderator.packery.layout();
  }

}




window.onload = function() {
  moderator.demo.loadData();
  moderator.main.init();
}
