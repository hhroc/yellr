'use strict';
var moderator = moderator || {};


// functions to load demo stuff
moderator.demo = {
	loadData: function() {
		$.ajax({
		  url: 'data/submissions.json',
		  beforeSend: function( xhr ) {
		    xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
		  }
		})
	  .done(function( data ) {
	  	var json = $.parseJSON(data);

			// moderator.main.createGrid(json.latest, document.querySelector('.content.latest .grid'));
			// moderator.main.createGrid(json.approved, document.querySelector('.content.approved .grid'));
			// moderator.main.createGrid(json.pending, document.querySelector('.content.pending .grid'));
			// moderator.main.createGrid(json.denied, document.querySelector('.content.denied .grid'));
	  });
	}
}





// the actual stuff
moderator.main = {
	init: function() {
		// hook up navigation tabs
		// document.querySelector('#tabs').onclick = function(e) {
		// 	e.preventDefault();
		// 	if (e.target.nodeName == 'A') {
		// 		// update current tab
		// 		document.querySelector('#current-tab').id = '';
		// 		e.target.id = 'current-tab';

		// 		// update tab content
		// 		document.querySelector('#current-content').id = '';
		// 		document.querySelector('.content[data-tab="'+e.target.getAttribute('data-tab')+'"]').id = 'current-content';
		// 	}
		// };


		// // the good shit.
		// document.querySelector('#current-content').onclick = moderator.main.reject;
		// document.querySelector('#current-content').onclick = moderator.main.moderate;
	
		// set up the grid magic with packery
		var container = document.querySelector('.grid');
		var pckry = new Packery( container, {
			itemSelector: '.gi',
			columnWidth: container.querySelector('.grid-sizer'),
			gutter: container.querySelector('.gutter-sizer'),
			isResizeBound: true,
		});

		// set up content filtering
		moderator.filter.init( {grid:container});

	},

	moderate: function(e) {
		e.preventDefault();
		var story = e.target.offsetParent.offsetParent;
		var option = e.target.innerText.toLowerCase();
		if (option === 'approve') moderator.main.approve(story);
		if (option === 'reject') moderator.main.reject(story);
		if (option === 'edit') moderator.main.edit(story);
	},

	reject: function(story) {
		story.style.display = "none";
	},

	approve: function(story) {
		// console.log('approve');
		story.style.display = "none";
	},

	edit: function(e) {
		console.log('edit');
	},

	createGrid: function(data, target) {
		var frag = document.createDocumentFragment();

		// creates this:
		// ----------------------------
    // <li class="row">
    //   <ul class="row-list">
    // 		[insides is created elsewhere]
    // 	 </ul>
    // </li>

		var totalRows = Math.ceil(data.length / 3);
		var index = 0;

		for (var i = 0; i < totalRows; i++) {
			var row = document.createElement('li');
					row.className = 'row';
			var rowList = document.createElement('ul');
					rowList.className = 'row-list';

			// each row has 3 items
			for (var j = 0; j < 3; j++) {
				if (data[index]) {
					rowList.appendChild(moderator.main.createStoryItem(data[index]));				
				}
				index++;
			};

			row.appendChild(rowList);
			frag.appendChild(row);
		};

		// we're done
		target.appendChild(frag);
	},

	createStoryItem: function(data) {

		// spits this out at the end (example)
		// ----------------------------
		// <li class="story-item">
		//   <div class="media-preview"><img src="http://lorempixel.com/300/150"></div>
		//   <p class="from">12301200139</p>
		//   <p class="story">Merchandise</p>
		//   <div class="options">
		// 		<span> <i class="fa fa-check">Approve</i></span>
		// 		<span> <i class="fa fa-edit">Edit</i></span>
		// 		<span> <i class="fa fa-times">Reject</i></span>
		// 	</div>
		// </li>


		var li = document.createElement('li');
				li.className = 'story-item';
				li.setAttribute("draggable", true);
		
		var media_preview = document.createElement('div');
				media_preview.className = 'media-preview';
		var from = document.createElement('p');
				from.className = 'from';
		var story = document.createElement('p');
				story.className = 'story';

		var options = document.createElement('div');
				options.className = 'options';
		var approve = document.createElement('span');
		var approveIcon = document.createElement('i');
				approveIcon.className = 'fa fa-check';
				approveIcon.innerHTML = 'Approve';
				approve.appendChild(approveIcon);
		var edit = document.createElement('span');
		var editIcon = document.createElement('i');
				editIcon.className = 'fa fa-edit';
				editIcon.innerHTML = 'Edit';
				edit.appendChild(editIcon);
		var reject = document.createElement('span');
		var rejectIcon = document.createElement('i');
				rejectIcon.className = 'fa fa-times';
				rejectIcon.innerHTML = 'Reject';
				reject.appendChild(rejectIcon);
		options.appendChild(approve);
		options.appendChild(edit);
		options.appendChild(reject);

		// add data
		var media;
		if (data.content.type == 'image') {
			media = document.createElement('img');
			media.src = data.content.url;
		}
		// if type = video
		// if type = text
		// if type = audio
		media_preview.appendChild(media);
		from.innerHTML = data.UID;
		story.innerHTML = data.story_alias;

		// put it all together
		li.appendChild(media_preview);
		li.appendChild(from);
		li.appendChild(story);
		li.appendChild(options);

		return li;
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
	}

}




window.onload = function() {
	moderator.demo.loadData();
	moderator.main.init();
}