'use strict';
var yellr = yellr || {};

yellr.demo = {
	init: function() {
		console.log('load sample data');


		// load sample profile
		yellr.utils.load('data/profile.json', function(response) {
			// parse user profile
			yellr.parse.profile(
				JSON.parse(response.responseText)
			);
		});


		// load sample assignments
		yellr.utils.load('data/assignments.json', function(response) {
			// parse assignments
			yellr.parse.assignments(
				JSON.parse(response.responseText)
			);
		});


	}
}