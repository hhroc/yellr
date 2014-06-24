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

		// // set up content filtering
		// var inputs = document.querySelectorAll('.filter-div input');
		// for (var i = 0; i < inputs.length; i++) {
		// 	inputs[i].onkeyup = moderator.main.filter;
		// };

		// // the good shit.
		// document.querySelector('#current-content').onclick = moderator.main.reject;
		// document.querySelector('#current-content').onclick = moderator.main.moderate;
	
		// set up the grid magic with packery
		var container = document.querySelector('.grid');
		var size = document.querySelector('.grid-sizer');
		var gutter = document.querySelector('.gutter-sizer');
		var pckry = new Packery( container, {
			// options
			columnWidth: size,
			itemSelector: '.gi',
			gutter: gutter,
			isResizeBound: true,
		});
	},

	filter: function() {
		var text = this.value.toLowerCase();
		var regex = new RegExp(text);

		var grid = this.offsetParent.lastElementChild;
		var stories = grid.querySelectorAll('.story-item');

		for (var i = 0; i < stories.length; i++) {
			var story = stories[i];
			var story_text = story.querySelector('.story').innerHTML.toLowerCase();

			// if the text does not match any search text, give it a class of "filtered-out"
			// String.search(regex) returns -1 if it does not match
			if (!story_text.search(regex)) {
				// match
				// ----------------------------
				if (story.classList.contains('filtered-out')) {
					story.className = 'story-item';
				}
			} else {
				story.className += ' filtered-out';
			}
		};
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


window.onload = function() {
	moderator.demo.loadData();
	moderator.main.init();
}