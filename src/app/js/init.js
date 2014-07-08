'use strict';
var yellr = yellr || {};

/*
	We call our setup functions as soon as we're ready
	They are fired in the following sequence:
		1. onload()
		2. deviceready()
*/

window.onload = function() {
	yellr.setup.DOM();
	// yellr.demo.init(); // uses local dummy json
	// yellr.load.data(); // for production
}

document.addEventListener('deviceready', function() {
	yellr.setup.app();
}, false);