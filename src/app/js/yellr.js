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






yellr.setup = {

	DOM: function() {
		/*
			set up the DOM
			mostly cosmetic things, caching DOM queries, setting up buttons
		*/
		console.log('setup DOM');


		// setup buttons
		// ====================================
		// in app header --> show more options
		document.querySelector('#more-btn .toggle').onclick = yellr.toggle.more_options;

		// when submitting report --> show/add more details
		document.querySelector('#submit-footer .flex').onclick = yellr.toggle.report_details;


		// set up app DOM references
		// ===================================
		yellr.app.setup({
			self: document.querySelector('#app'),
			header: document.querySelector('#header'),
			footer: document.querySelector('#footer')
		});

		// set the routing/view system of the app
		yellr.app.route('#');

	},



	app: function() {

		console.log('setup app');
		var debug = document.querySelector('#debug');

		// Language
		navigator.globalization.getPreferredLanguage(
			function(language) {
				console.log('hello from:');
				document.querySelector('#cordova-language').innerHTML = '' +
					'Language |' + language.value;
			},
			function() {
				// error
				document.querySelector('#cordova-language').innerHTML = '' +
					'Error getting language';
			}
		);

		
		// Device API feedback
		document.querySelector('#cordova-device').innerHTML = '' +
			'Device UUID     | ' + device.uuid + '<br/>'+
			'Device Platform | ' + device.platform + '<br/>'+
			'Device Model    | ' + device.model + '<br/>'+
			'Device Version  | ' + device.version + '<br/>'+
			'Device Cordova  | ' + device.cordova + '<br/>';

		// Connection type
		var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    document.querySelector('#cordova-connection').innerHTML = 'Connection type: ' + states[networkState];
	

    // Location API
    navigator.geolocation.getCurrentPosition(function(position) {
			// success geting location
			document.querySelector('#cordova-position').innerHTML = '' +
				'Latitude 					|' + position.coords.latitude + '<br />' +
				'Longitude 					|' + position.coords.longitude + '<br />' +
				'Altitude 					|' + position.coords.altitude + '<br />' +
				'Accuracy 					|' + position.coords.accuracy + '<br />' +
				'Altitude Accuracy 	|' + position.coords.altitudeAccuracy + '<br />' +
				'Heading 						|' + position.coords.heading + '<br />' +
				'Speed 							|' + position.coords.speed + '<br />' +
				'Timestamp 					|' + position.timestamp + '<br />';
    }, function(error) {
    	// error getting location
			document.querySelector('#cordova-position').innerHTML = '' +
	    	'Error Code 	|' + error.code + '<br/>' +
	      'Message 			|' + error.message;
    });


    // add extra Cordova events
    // ===================================
    document.addEventListener('pause', function() {
    	// when user opens a different app
    	// when this app goes into the background
    }, false);

    document.addEventListener('resume', function() {
    	// when the user comes back to this app
    }, false);

    document.addEventListener('online', function() {
    	// when the device connects to the internet
    }, false);

    document.addEventListener('offline', function() {
			// when the device loses its internet connection
    }, false);

    document.addEventListener('batterycritical', function(e) {
    	// critical battery low
    	document.querySelector('#cordova-battery').innerHTML = ''+
	    	'Battery Level Critical: ' + info.level + '<br/>' +
    		'Plugged In: ' + e.isPlugged;
    }, false);

    document.addEventListener('batterylow', function(e) {
    	// critical battery low
    	document.querySelector('#cordova-battery').innerHTML = ''+
	    	'Battery Level Critical: ' + info.level + '<br/>' +
    		'Plugged In: ' + e.isPlugged;
    }, false);


		// hide splash screen
		navigator.splashscreen.hide();

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
