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
