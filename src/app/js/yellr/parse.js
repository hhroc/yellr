'use strict';
var yellr = yellr || {};

/*
	Parse JSON objects into HTML elements
*/

yellr.parse = {
	profile: function(json, target) {
		console.log('yellr.parse.profile');

		var username = document.querySelector('#username');
		username.innerHTML = json.username;
		// yellr.profile.username = json.username;

	},

	assignments: function(json, _target) {
		/*
			this makes our Latest Assignments list
			it takes a JSON array, parse it into HTML
			_target (optional) if you want the final thing built somewhere else..
		*/
		console.log('yellr.parse.assignments');

		var target = $('#latest-assignments');
		if (_target) target = _target; // override target destination


		// for the list we just want:
		// 	title, id, deadline, and contributions
		var frag = document.createDocumentFragment();
		for (var i = 0; i < json.length; i++) {
			// get the values
			var ass = json[i]; // LOL
			// build HTML
			var li = document.createElement('li');
			var a = document.createElement('a');
					a.setAttribute('href', '#assignments/' + ass.id);
			var h2 = document.createElement('h2');
					h2.className = 'assignment-title';
					h2.innerHTML = ass.title;
			var div = document.createElement('div');
					div.className = 'assignment-action';
			var details = document.createElement('p');
					details.className = 'view-assignment-details';
					details.innerHTML = 'View assignment';
			var contribs = document.createElement('p');
					contribs.className = 'assignment-contributions';
					contribs.innerHTML = ass.contributions;
			var deadline = document.createElement('p');
					deadline.className = 'assignment-deadline';
					deadline.innerHTML = ass.deadline;
			// piece it together
			div.appendChild(details);
			div.appendChild(contribs);
			a.appendChild(h2);
			a.appendChild(div);
			a.appendChild(deadline);
			li.appendChild(a);
			// add to frag
			frag.appendChild(li);
		};

		// add the newly rendered assignments
		target.prepend(frag);
		// recalculate height
		$('#pt-main').height(target.height() + $('#report-bar').height());

	}
}