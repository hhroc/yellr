'use strict';
var yellr = yellr || {};

/*
	Utility functions
	- load AJAX calls
*/

yellr.utils = {
	load: function(url, callback) {
		console.log('loading... ' + url);

		var request = null;
		if (window.XMLHttpRequest) request = new XMLHttpRequest();
		else if (window.ActiveXObject) request = new ActiveXObject('Microsoft.XMLHTTP');

		if (request !== null) {
			request.onreadystatechange = function() {
				// make sure request is Loaded
				if (request.readyState == 4) {
					// status code == OK (200)
					if (request.status == 200) {
						console.log('done loading.. ' + url, request);
						callback(request);
					}
				}
			}
	    request.open('GET', url, true);  // true means non-blocking/asynchronous I/O
	    request.send('');
		} else console.log('error loading: ' + url);
	},

	clearNode: function(DOMnode) {
	  while(DOMnode.hasChildNodes()) 
	  	DOMnode.removeChild(DOMnode.firstChild);
	}
};