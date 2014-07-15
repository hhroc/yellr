'use strict';
var yellr = yellr || {};

/*
	Parse JSON objects into HTML elements
*/

yellr.parse = {
	profile: function(json, target) {
		// console.log('yellr.parse.profile');

		var username = document.querySelector('#username');
		username.innerHTML = json.username;
		// yellr.profile.username = json.username;

	},

	assignment: function(json, format) {
		/* this builds a single HTML assignment */
		// format: 'li', 'view'
		// 		<li> or <section class="assignment-view"
		if (format === 'li') {
			/*
			Creates this:
			  <li>
			    <a href="#assignments/00001">
			      <h2 class="assignment-title">Who makes the best cup-of-soup?</h2>
			      <div class="assignment-action">
			        <p class="view-assignment-details">View assignment</p>
			        <p class="assignment-contributions">24</p>
			      </div>
			      <p class="assignment-deadline">6 days</p>
			    </a>
			  </li>
			*/ 
			var li = document.createElement('li');
			var a = document.createElement('a');
					a.setAttribute('href', '#assignments/' + json.id);
			var h2 = document.createElement('h2');
					h2.className = 'assignment-title';
					h2.innerHTML = json.title;
			var div = document.createElement('div');
					div.className = 'assignment-action';
			var details = document.createElement('p');
					details.className = 'view-assignment-details';
					details.innerHTML = 'View assignment';
			var contribs = document.createElement('p');
					contribs.className = 'assignment-contributions';
					contribs.innerHTML = json.contributions.length;
			var deadline = document.createElement('p');
					deadline.className = 'assignment-deadline';
					deadline.innerHTML = json.deadline;
			// piece it together
			div.appendChild(details);
			div.appendChild(contribs);
			a.appendChild(h2);
			a.appendChild(div);
			a.appendChild(deadline);
			li.appendChild(a);
			return li;
		}
		// proper term TBD, unsure which one is moe convneient
		if (format === 'view' || format === 'page' || format === 'section') {
			/*
			Creates this:
				<section class="assignment-view">
				  <h2 class="assignment-title">Are you on Team Viper or Team Mountain?</h2>
				  <figure class="assignment-details-image"><img src="http://lorempixel.com/800/400"/></figure>
				  <p class="assignment-details">The carriage stopped at the gate of the Collège de France; Mme. Chambannes alighted briskly. She did not take the trouble to close the door and, swinging her muff, hurried through the somber courtyard, where three pigeons wandered in the security that silence and solitude ensured them.</p>
				  <a href="#" class="contribute-to-assignment">Contribute</a>
				  <div class="accepted-media-wrapper">
				  <em>Accepted Media:</em>
				    <ul class="accepted-media">
				      <li><i class="fa fa-video-camera"></i></li>
				      <li><i class="fa fa-camera"></i></li>
				      <li><i class="fa fa-volume-up"></i></li>
				      <li><i class="fa fa-file-text-o"></i></li>
				    </ul>
				  </div>
				  <p class="assignment-deadline">June 12, 2014</p>
				</section>
			*/
			var frag = document.createDocumentFragment();
			/* we use a frag since we have both a section and an aside at the same DOM level */

			// assignment details
			// ----------------------------
			var section = document.createElement('section');
					section.className = 'assignment-view';

		  // <h2 class="assignment-title">Are you on Team Viper or Team Mountain?</h2>
			var h2 = document.createElement('h2');
					h2.className = 'assignment-title';
					h2.innerHTML = json.title;
					section.appendChild(h2);

			// add image
			// <figure><img src="http://lorempixel.com/800/400"/></figure>
			if (json.image) {
				var figure = document.createElement('figure');
						figure.className = 'assignment-details-image';
				var img = document.createElement('img');
						img.src = json.image;
				figure.appendChild(img);
				section.appendChild(figure);
			}
			// description
			var p = document.createElement('p');
					p.className = 'assignment-details';
					p.innerHTML = json.description;
					section.appendChild(p);

		  // <a href="#" class="contribute-to-assignment">Contribute</a>
			var a = document.createElement('a');
					a.className = 'contribute-to-assignment';
					a.innerHTML = 'Contribute';
					section.appendChild(a);

		  // <div class="accepted-media-wrapper">		
			var div = document.createElement('div');
					div.className = 'accepted-media-wrapper';
		  // <em>Accepted Media:</em>	
			var em = document.createElement('em');
					em.innerHTML = 'Accepted media:';
					div.appendChild(em);

	    // <ul class="accepted-media">
	    //   <li><i class="fa fa-video-camera"></i></li>
	    //   <li><i class="fa fa-camera"></i></li>
	    //   <li><i class="fa fa-volume-up"></i></li>
	    //   <li><i class="fa fa-file-text-o"></i></li>
	    // </ul>
			var ul = document.createElement('ul');
					ul.className = 'accepted-media';
			for (var i = 0; i < 4; i++) {
				var li = document.createElement('li');
				var icon = document.createElement('i');
						icon.className = 'fa';
				if (i === 0) icon.className += ' fa-video-camera';
				if (i === 1) icon.className += ' fa-camera';
				if (i === 2) icon.className += ' fa-volume-up';
				if (i === 3) icon.className += ' fa-file-text-o';
				li.appendChild(icon);
				ul.appendChild(li);
			};
			div.appendChild(ul);
			section.appendChild(div);


		  // <p class="assignment-deadline">June 12, 2014</p>		
			var deadline = document.createElement('p');
					deadline.className = 'assignment-deadline';
					deadline.innerHTML = json.deadline;
					section.appendChild(deadline);


			/* <section> done, add to frag */
			frag.appendChild(section);




			// assignment contributions
			// ----------------------------
			// this should probably go somewhere else...
			/*
			<aside class="assignment-contributions">
			  <h3>Latest Contributions</h3>
			  <ul class="assignment-contributions-list">
			    <li>
			    	<a href="#">
			    		<span class="contributor">DanDan109</span>
			        <p>Through the panes of the glass door M. Pageot, first usher of the Collège, watched her approach, his thick mustache slightly lifted in a smile of sympathy.</p>
			      </a>
			    </li>
			  </ul>
			</aside>
			*/
			var aside = document.createElement('aside');
					aside.className = 'assignment-contributions';
			var h3 = document.createElement('h3');
					h3.innerHTML = 'Latest Contributions';
					aside.appendChild(h3);
			var contributions = document.createElement('ul');
					contributions.className = 'assignment-contributions-list';

			for (var i = 0; i < json.contributions.length; i++) {
				// console.log(json.contributions[i]);
				var contrib = json.contributions[i];
				var li2 = document.createElement('li');
				var a2 = document.createElement('a');
						a2.href = '#';
				var contributor = document.createElement('span');
						contributor.innerHTML = contrib.user;
				var content;
				// text post
				if (contrib.report.type === 0) {
					content = document.createElement('p');
					content.innerHTML = contrib.report.content;
				}
				// long text post
				if (contrib.report.type === 1) {};
				// text + picture (image first)
				if (contrib.report.type === 2) {};
				// text + picture (text first)
				if (contrib.report.type === 3) {};

				a2.appendChild(contributor);
				a2.appendChild(content);
				li2.appendChild(a2);
				contributions.appendChild(li2);
			};

			aside.appendChild(contributions);

			/* <aside> done, append to frag */
			frag.appendChild(aside);



			/* frag done, add to target DOM */
			// ===================================
			// ===================================
			$('#view-assignment').html(frag);

		}

	},

	assignments: function(json, _target) {
		/*
			this makes our Latest Assignments list
			it takes a JSON array, parse it into HTML
			_target (optional) if you want the final thing built somewhere else..
		*/
		// console.log('yellr.parse.assignments');

		// make <li>s with JSON array
		var frag = document.createDocumentFragment();
		for (var i = 0; i < json.length; i++) {
			frag.appendChild(this.assignment(json[i], 'li'));
		};

		// add to target DOM
		var target = $('#latest-assignments');
		if (_target) target = _target; // override target destination
		target.prepend(frag);

		// // recalculate height
		// $('#pt-main').height(target.height() + $('#report-bar').height());

	}
}