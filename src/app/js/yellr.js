'use strict';
var yellr = yellr || {};


/*
	the Yellr js objects is made up of:
	yellr = {
		setup: {
			// which handles basic setup for the DOM and app
			// checks yellr.config obj
		},
		toggle: {
			// to handle toggling things
		}
	}
*/

yellr.app = {
	// This object holds all the DOM references
	self: undefined,
	header: undefined,
	footer: undefined,
	setup: function(refs) {
		// pass in an object with DOM refs for quick setup
		// you can set each one manually
		this.self = refs.self;
		// watch data-attr changes
		var watcher = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				console.log(mutation);
				console.log(mutation.type);
				if (mutation.attributeName == 'data-state') {
					alert('change data-state attr');
				}
			})
		});
		// settings
		var settings = {
			attributes: true,
			childList: true,
			characterData: false
		};
		// set it
		watcher.observe(this.self, settings);

		this.header = refs.header;
		this.footer = refs.footer;
		console.log('finish yellr.app.setup');
		console.log(this);
	}
}

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


		// set up toggle for content submission
		document.querySelector('#submit-footer .flex').onclick = yellr.toggle.report_details;


		// set up app DOM references
		yellr.app.setup({
			self: document.querySelector('#app'),
			header: document.querySelector('#header'),
			footer: document.querySelector('#footer')
		});


		var state = document.querySelector('#app').getAttribute('data-state');
		if (state === 'index') {
			console.log('state: ' + state);

			console.log('test change on attr');
			yellr.app.self.setAttribute('data-state','test');
			// var header = 
			// header = index;
			// footer = report_bar;
		}

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
	},
	report_details: function(e) {
		// the element holding the extra info
		var container = document.querySelector('#submit-footer .more-info');
		// current info showin
		var current = container.getAttribute('data-current');
		// what was just selected
		var selected = e.target.getAttribute('data-info') || e.target.parentNode.getAttribute('data-info');
		console.log(current, selected);

		// show the thing
		if (current === 'none') {
			container.className = container.className.split(' hidden')[0];
		}


		var target;
		var extras = document.querySelectorAll('.extra-info');
		for (var i = 0; i < extras.length; i++) {
			// clear selected classname
			extras[i].className = extras[i].className.split('selected')[0];
			// find our target
			if (extras[i].getAttribute('data-info') == selected)
				target = extras[i];
		}
		console.log(target);
		target.className += ' selected';
		container.setAttribute('data-current', selected);

		// if (selected === current) {
		// 	container.className += ' hidden';
		// }

		// close it if we have a toggle
		if (selected === current) {
			container.className += ' hidden';
			container.setAttribute('data-current', 'none');
		}

	}
}
