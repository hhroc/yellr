'use strict';
var yellr = yellr || {};

yellr.demo = {
	init: function() {
		console.log('load sample data');

		// targets
		var assignments = $('#latest-assignments'),
				newsfeed,
				notifications,
				messages,
				profile;



		// load sample assignments
		$.getJSON('data/assignments.json', function(data){
		  yellr.parse.assignments(data);
		});



		// load sample profile
		$.getJSON('data/profile.json', function(data){
		  yellr.parse.profile(data);
		});


	}
}