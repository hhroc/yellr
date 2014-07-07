'use strict';
var yellr = yellr || {};

/*
	Parse JSON objects into HTML elements
*/

yellr.parse = {
	profile: function(json) {
		console.log('yellr.parse.profile');

		var username = document.querySelector('#username');
		username.innerHTML = json.username;
		yellr.profile.username = json.username;

	},

	assignments: function(json) {
		console.log('yellr.parse.assignments');
	}
}