'use strict';
var yellr = yellr || {};


/*
	the Yellr js objects is made up of:
	yeller = {
		setup: {
			// which handles basic setup for the DOM and app
		},
		toggle: {
			// to handle toggling things
		}
	}
*/



yellr.setup = {
	DOM: function() {
		/*
			set up the DOM
			mostly cosmetic things.. setting classes to things and such
		*/
		console.log('setup DOM');


		// set up Menu toggle for more options
		var toggle = document.querySelector('#more-btn .toggle');
		toggle.onclick = yellr.toggle.more_options;

	},
	app: function() {
		console.log('setup app');
	}
};



yellr.toggle = {

	more_options: function(e) {
		// toggle class="hidden", set attribute
		var moreList = document.querySelector('.more-options-list');

		if (moreList.getAttribute('data-hidden') === 'true') {
			moreList.className = moreList.className.split(' hidden')[0];
			moreList.setAttribute('data-hidden', 'false');
		} else {
			moreList.className += ' hidden';
			moreList.setAttribute('data-hidden', 'true');
		}

	}
}
