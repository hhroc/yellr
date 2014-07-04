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


		if (!Modernizr.flexbox) yellr.fallback.flexbox();


		// hide More options list
		var doc = document;
		var toggle = document.querySelector('#more-btn .toggle');
		toggle.onclick = yellr.toggle.more_options;
		yellr.toggle.more_options();

		// var moreList = doc.querySelector('.more-options-list');
		// if (moreList.getAttribute('data-hidden')) {
		// 	moreList.className += ' hidden';
		// }


	},
	app: function() {
		console.log('setup app');
	}
};




yellr.toggle = {
	more_options: function(e) {
		var moreList = document.querySelector('.more-options-list');
		if (moreList.getAttribute('data-hidden')) {
			var c = moreList.className.split(' hidden')[0];
			moreList.className = c;
		} else {
			moreList.className += ' hidden';
			moreList.setAttribute('data-hidden', true);
		}

	}
}

yellr.fallback = {
	flexbox: function() {
		// fall back for flexbox
		alert('do fallback for flexbox');
		document.querySelector('.header-nav-list').className += ' fallback';
	}
}