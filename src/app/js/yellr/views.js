'use strict';
var yellr = yellr || {};

/*
	Our app views
*/

yellr.route = function(view) {
	/* view could be:
		- an event
		- a string

		called on hashchange, and yellr.route('#page-id')
	 */

	// do nothing if we're already on the page being called
	if (view === window.location.hash) return;


	// if string change window hash
	// which will call this function again..
	if (typeof view == 'string') {
		window.location.hash = view;
	} else {
		// get window hash now that it has been set
		var url = window.location.hash;

		// get the hash
		var hash = url.split('/')[0];
		if (hash === '') hash = '#';

		// check if there is an ID being passed, or other parameters
		// ex: #assignments/123123
		var id = url.split('/')[1];
		
		// feedback
		console.log(hash, id);



	// do things based on the hash
	// ===================================
		// index
		// ----------------------------
		if (hash === '#') {
			// main app header
			$('#homepage-subnav').show();

			// done for inital setup
			// must set the height of #pt-main
			// set it to the height of #assignments
			var h = $('#assignments').height();
			var footer = $('#report-bar').height();
			$('#pt-main').css('height', h+footer);
			$('#main').addClass('with-secondary-nav');

			// $('#assignments-tab').addClass('current');
			yellr.toggle.homepage({
	      pageID: '#assignments'
	    });
      // yellr.pageManager.nextPage('#assignments', 12);

		}


		// assignments
		// ----------------------------
    /* each assignment is a link, which automagically changes the hash, which calls the function below */
		if (hash === '#assignments') {

			// show all assignments
			if (id === undefined) {
				$('#main').addClass('with-secondary-nav');
		    
		    yellr.toggle.homepage({
		      pageID: '#assignments'
		    });
			}

			// show single assignment
			if (id) {
				// find the right one first
				var assignments = JSON.parse(localStorage.getItem('assignments'));

				for (var i = 0; i < assignments.length; i++) {
					// careful, the 'id' var came fromt a string split
					if (assignments[i].id === parseInt(id)) {
						// we have a match
						yellr.parse.assignment(assignments[i], 'view');
						yellr.route('#view-assignment');
						break;
					}
				};
			}
		}

		/* view an assignment */
		if (hash === '#view-assignment') {
      yellr.pageManager.nextPage('#view-assignment', 12);
		}






	}
	// ----------------------------
	// end else








/*


		if (hash === '#news-feed') {
			$('#main').addClass('with-secondary-nav');

	    yellr.toggle.homepage({
	      pageID: '#news-feed'
	    });
		}
		if (hash === '#news-story') {
			
		}
		if (hash === '#notifications') {
			$('#homepage-subnav').hide();
			$('#main').removeClass('with-secondary-nav');
		}
		if (hash === '#messages') {
			$('#homepage-subnav').hide();
			$('#main').removeClass('with-secondary-nav');

		}
		if (hash === '#view-messages') {
			$('#homepage-subnav').hide();
			$('#main').removeClass('with-secondary-nav');

		}
		if (hash === '#profile') {
			$('#homepage-subnav').hide();
			$('#main').removeClass('with-secondary-nav');

		}
		if (hash === '#submit-form') {
			$('#homepage-subnav').hide();
			$('#main').removeClass('with-secondary-nav');
      yellr.pageManager.nextPage('#submit-form', 19);
		}

*/
	// }
};
