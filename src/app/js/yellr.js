'use strict';
var yellr = yellr || {};


/*
	the Yellr js objects is made up of:
	yellr = {
		app: {
			// DOM references for app
			// handles our views
		},
		setup: {
			// which handles basic setup for the DOM and app
			// checks yellr.config obj
		},
		toggle: {
			// to handle toggling things
		}
	}
*/





/*
	Holds mostly DOM references
*/ 
yellr.app = {

	state: '#',
	self: undefined,
	header: {
		container: undefined,
		current: undefined,
		set: function(dom) {
			// hide the old one
			if (this.current) this.current.className += ' hidden';
			// set the new one
			this.current = dom;
			this.current.className = this.current.className.split(' hidden')[0];
		}
	},
	footer: {
		container: undefined,
		current: undefined,
		set: function(dom) {
			// hide the old one
			if (this.current) this.current.className += ' hidden';
			// set the new one
			this.current = dom;
			this.current.className = this.current.className.split(' hidden')[0];
		}
	},
	
	// functions
	setup: function(refs) {
		// pass in an object with DOM refs for quick setup
		// you can set each one manually
		this.self = refs.self;
		this.header.container = refs.header;
		this.footer.container = refs.footer;
	},


	route: function(hash) {
		/* our routing function */
		// pass in a string and the app sets itself up
		// this uses an object to handle routes
		
		this.state = hash;
		this.self.setAttribute('data-state', hash);

		// set header, set footer
		if (this.state === '#') {
			yellr.app.header.set(document.querySelector('#app-header'));
			yellr.app.footer.set(document.querySelector('#report-bar'));
		}

	}
}











yellr.toggle = {

	homepage: function(e) {
		// clear class of other nav-option
		$('#homepage-subnav .current').removeClass('current');

		// set class current to the correct div
		var target = (e.target.localName === 'a') ? e.target.parentNode : e.target;
		$(target).addClass('current');
	},

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
