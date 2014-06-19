'use strict';
var moderator = moderator || {};

moderator.main = {
	init: function() {
		// hook up tabs
		document.querySelector('#tabs').onclick = function(e) {
			e.preventDefault();
			if (e.target.nodeName == 'A') {
				console.log(e.target.getAttribute('data-tab'));
				// update current tab
				document.querySelector('#current-tab').id = '';
				e.target.id = 'current-tab';

				// update tab content
				document.querySelector('#current-content').id = '';
				document.querySelector('.content[data-tab="'+e.target.getAttribute('data-tab')+'"]').id = 'current-content';
			}
		};

		// set up content filtering
		var inputs = document.querySelectorAll('.filter-div input');
		for (var i = 0; i < inputs.length; i++) {
			inputs[i].onkeyup = moderator.main.filter;
		};

		// the good shit.
		// document.querySelector('#latest-submissions').onclick = function(e) {
		// 	e.preventDefault();
		// 	console.log(e.target);
		// }
	},

	filter: function() {
		// console.log(this);
		console.dir(this);
		console.dir(this.offsetParent);
		console.log(this.value);
		console.log(this.offsetParent.lastElementChild);
		// console.log('hello from:'+this);
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

moderator.story_template = Handlebars.compile($('#story-tmpl').html());


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

	  	moderator.main.createGrid(json.latest, document.querySelector('.content.latest .grid'));
	  	moderator.main.createGrid(json.approved, document.querySelector('.content.approved .grid'));
	  	moderator.main.createGrid(json.pending, document.querySelector('.content.pending .grid'));
	  	moderator.main.createGrid(json.denied, document.querySelector('.content.denied .grid'));
	  });



	}
}

window.onload = function() {
	moderator.demo.loadData();
	moderator.main.init();
}