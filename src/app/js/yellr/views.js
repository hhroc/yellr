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
	var app = document.querySelector('#app'), // cached app ref
			current_state; // <body id="app" data-state="#">, the data-attr
	var hash, // hash tells us which page to show, 	ex. #assignments
			id;		// ID is for showing a specific entry of that page 	ex. #assignments/12312
	var src; 	// this is a URL, or a passed in string





	// Handlebar template shiiiiii
	// ===================================
	// should all be query selectors. ex: '#main-header'
	var header = '#main-header'; // header default: #main-header
	/* #main-header - #page-header - #submit-header */

	var hasSubnav = false; // hide/show secondary nav
	var subNav = undefined;
	/* assignments/news-feed - inbox/sent/drafts */

	var hasFooter = false;
	var footer = '#report-bar'; // footer default: #report-bar
	/* report bar - submit bar */

	var context = {}; // passed into our Handlebar templates
	// the properties of this JS object depend on the hash





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


	// do things for first run
	if (current_state === '#') {
		hasSubnav = true;
		$(hash).addClass('current');
		$('#assignments-tab').addClass('current');
		document.querySelector('#app').setAttribute('data-state', hash);
	}

	// check to make sure we're not repeating ourselves
	// ie. are we already on the page? if so, do nothing
	else if (current_state !== hash || id) {

		app.setAttribute('data-state', hash);

		// do things based on hash
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
					header = '#page-header';

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
				// show all reports
				// ----------------------------
				// show single report
				// ----------------------------
				break;
			case '#profile':
				// hasSubnav = false;
				header = '#page-header';
				console.log('show profile');
				break;
			case '#notifications':
				header = '#page-header';
				console.log('show notifications');
				break;
			case '#messages':
				header = '#page-header';
				console.log('show messages');
				break;
			case '#submit-form':
				header = '#submit-header';
				console.log('show submit-form');
				break;
			case '#view-story':
				// this'll probably follow the schema of 
				header = '#page-header';
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




	// Making it look pretty (executes everytime)
	// ===================================
	
	// template stuff
	// ----------------------------
	console.log(header);
	console.log(footer);
	var header_template = Handlebars.compile($(header).html());
	var footer_template = Handlebars.compile($(footer).html());
	$('#app-header').html(header_template(context));


	// details bro
	if (hasSubnav) $('#homepage-subnav').show();
	else $('#homepage-subnav').hide();




};
