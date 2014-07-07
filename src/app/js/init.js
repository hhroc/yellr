'use strict';
var yellr = yellr || {};

/*
	We call our setup functions as soon as we're ready
	They are fired in the following sequence:
		- onload()
		- deviceready()
*/

window.onload = function() {
	console.log('hello from: yellr 2.0');
	yellr.setup.DOM();
}

document.addEventListener('deviceready', function() {
	yellr.setup.app();
}, false);