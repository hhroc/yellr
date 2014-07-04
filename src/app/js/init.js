'use strict';
var yellr = yellr || {};


window.onload = function() {
	console.log('hello from: yellr 2.0');
	yellr.init.run();
}

document.addEventListener('deviceready', function() {
	alert('hello from: yellr deviceready');
	yellr.init.app_test();

}, false);
