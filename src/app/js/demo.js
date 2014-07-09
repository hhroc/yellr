'use strict';
var yellr = yellr || {};

yellr.demo = {
	init: function() {
		console.log('load sample data');


		// load sample profile
		$.getJSON('data/profile.json', function(data){
		  yellr.parse.profile(data);
		});


		// load sample assignments
		$.getJSON('data/assignments.json', function(data){
		  yellr.parse.assignments(data);
		});

	}
}