'use strict';
var yellr = yellr || {};

/*
	Our app views

		view could be:
		- an event
		- a string

	called on hashchange, and yellr.route('#page-id')
*/

yellr.route = function(view) {


	// the only vars we care about
	// ===================================
	var current_state; // <body id="app" data-state="#">, the data-attr
	var app = document.querySelector('#app'); // cached ref
	var hash, id;
	// hash tells us which page to show, ID is for showing a specific entry of that page
	// ex. #assignments, #assignments/12312
	var src; // this is a URL, or a passed in string
	// ex. '#assignments', '#assignments/2312'

	// to help make things look pretty
	var hasSubnav = false; // hide/show secondary nav
	// var hasFooter = false; // add to padding-bottom #main if true



	// the logic
	// ===================================
	// the beginning
	if (typeof view === 'string') {
		src = view;
		window.location.hash = view;
	} else {
		src = window.location.hash;
	}


	// get current app state
	current_state = app.getAttribute('data-state');

	// get the hash
	hash = src.split('/')[0];
	if (hash === '' || hash === '#') hash = '#assignments'; // default view: assignments
	
	// check for an ID
	id = src.split('/')[1];


	// console.log(hash, current_state, id);

	// do things for first run
	if (current_state === '#') {
		console.log('first run');
		hasSubnav = true;
		$(hash).addClass('current');
		$('#assignments-tab').addClass('current');
		document.querySelector('#app').setAttribute('data-state', hash);
	}
	else if (current_state !== hash || id) {
		// check to make sure we're not repeating ourselves
		// ie. are we already on the page? if so, do nothing

		app.setAttribute('data-state', hash);

		// console.log(hash, current_state, id);

		switch (hash) {

			// Assignments
			// ===================================
			case '#assignments':
				// show all assignments
				// ----------------------------
				if (id === undefined) {
					hasSubnav = true;
					// console.log('show assignments');
				}
				// show single assignment
				// ----------------------------
				if (id) {
					// console.log('show assignment: '+id);
					// find the right one first
					var assignments = JSON.parse(localStorage.getItem('assignments'));

					for (var i = 0; i < assignments.length; i++) {
						// careful, the 'id' var came fromt a string split
						if (assignments[i].id === parseInt(id)) {
							// we have a match
							yellr.parse.assignment(assignments[i], 'view');
							// yellr.route('#view-assignment');
							break;
						}
					}

					// change the hash to view-assignments
					hash = '#view-assignment'; // make sure we show/hide the right DOMs
					// change app state
					app.setAttribute('data-state', hash);
				}
				break;


			// News Feed
			// ===================================
			case '#news-feed':
				hasSubnav = true;
				console.log('show news-feed');
				break;
			case '#profile':
				// hasSubnav = false;
				console.log('show profile');
				break;
			case '#notifications':
				console.log('show notifications');
				break;
			case '#messages':
				console.log('show messages');
				break;
			case '#submit-form':
				console.log('show submit-form');
				break;
			case '#view-story':
				console.log('show view-story');
				break;
			default:
				console.log('homepage - ie assignments');
		} // end switch statement



		// clear last class
		$('.pt-perspective .current').removeClass('current');
		// set new one
		$(hash).addClass('current')
	}// end if...else



	// details bro
	if (hasSubnav) $('#homepage-subnav').show();
	else $('#homepage-subnav').hide();




};
