'use strict';
var z = z || {};

z.main = {
	init: function() {
		console.log('hello from: main.js');
	}
};

window.onload = function() {
	z.main.init();
}