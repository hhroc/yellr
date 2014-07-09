'use strict';
var yellr = yellr || {};

/*
	Our app views
*/

yellr.route = function(hash) {

	// call this on hashchange
	// if a hash has been passed in, show that, and update has

	// prevent weirdness
	if (hash === window.location.hash) return;
	// if (window.location.hash === '') return;

	// if string change window hash
	// which will call this function again..
	if (typeof hash == 'string') {
		window.location.hash = hash;
	}
	// } else {

		// hash should be an object now
		// turn 'hash' into the URL hash
		hash = window.location.hash;
		if (hash === '') hash = '#';

		console.log(hash);


		// do things based on the hash
		if (hash === '#') {
			// main app header
			$('#homepage-subnav').show();
			// $('#main').removeClass('with-secondary-nav');
			// $('#main').addClass('with-secondary-nav');

			// done for inital setup
			// must set the height of #pt-main
			// set it to the height of #assignments
			var h = $('#assignments').height();
			$('#pt-main').css('height', h);
			// $('#assignments-tab').addClass('current');
			yellr.toggle.homepage({
	      pageID: '#assignments'
	    });
		}

		if (hash === '#assignments') {
	    // yellr.pageManager.nextPage('#assignments', 12);
	    yellr.toggle.homepage({
	      pageID: '#assignments'
	    });
		}
		if (hash === '#view-assignment') {
			
		}
		if (hash === '#news-feed') {
	    yellr.toggle.homepage({
	      pageID: '#news-feed'
	    });
		}
		if (hash === '#news-story') {
			
		}
		if (hash === '#notifications') {
			$('#homepage-subnav').hide();
		}
		if (hash === '#messages') {
			$('#homepage-subnav').hide();
			
		}
		if (hash === '#view-messages') {
			$('#homepage-subnav').hide();
			
		}
		if (hash === '#profile') {
			$('#homepage-subnav').hide();
			
		}
		if (hash === '#submit-form') {
			$('#homepage-subnav').hide();
      yellr.pageManager.nextPage('#submit-form', 19);
		}


	// }
};
