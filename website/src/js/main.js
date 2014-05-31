'use strict';
var yellr = yellr || {};

yellr.main = {
	init: function() {
		console.log('hello from: main.js');

		// poll for any new questions from WXXI
		$.getJSON('data/question.json', function(data) {
			console.log('checking for new question... ');
			console.log(data);
			if (data.question_available) yellr.main.newQuestion(data);
		});
		// $.getJSON( "ajax/test.json", function( data ) {
		// $.getJSON( "data/question.json", function( data ) {
		// 	// var items = [];
		// 	console.log(data);
		// 	// $.each( data, function( key, val ) {
		// 	//   items.push( "<li id='" + key + "'>" + val + "</li>" );
		// 	// });

		// 	// $( "<ul/>", {
		// 	// 	  "class": "my-new-list",
		// 	// 	  html: items.join( "" )
		// 	// 	}).appendTo( "body" );
		// });
	},
	newQuestion: function(question) {
		console.log(question.question_texts[0]);
		for (var i = 0; i < question.answer_values.length; i++) {
			console.log(question.answer_values[i].answer_text);
		};
	}
};

window.onload = function() {
	yellr.main.init();
}