'use strict';
var yellr = yellr || {};




/* APP SETTINGS */
// ----------------------------

// width & height
yellr.width = undefined;
yellr.height = undefined;

// Language codes:
// 	1	-	english
// 	2	-	spanish 
yellr.language = 1;


/* DOM REFERENCES */
// ----------------------------
yellr.notificationNode = undefined;
yellr.questionNode = undefined;
yellr.questionClose = undefined;








// the things
yellr.main = {

	// set up the things
	// ===================================
	init: function() {

		/* get DOM references */
		// ----------------------------
		yellr.setUp.DOMreferences();


		// get window height and width, set to certain objects
		// src: http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript
		// ----------------------------
		var w = window,
				d = document,
				e = d.documentElement,
				g = d.getElementsByTagName('body')[0],
				x = w.innerWidth||e.clientWidth||g.clientWidth,
				y = w.innerHeight||e.clientHeight||g.clientHeight;
		yellr.width = x;
		yellr.height = y;
		// place offscreen
		yellr.utils.placeOffscreen(yellr.questionNode);


		/* poll for any new questions from WXXI */
		// ----------------------------
		$.ajax({
		  url: 'data/question.json',
		  beforeSend: function( xhr ) {
		    xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
		  }
		})
	  .done(function( data ) {
	  	var json = $.parseJSON(data);
			if (json.question_available) yellr.main.askQuestion(json);
			else console.log('no new question');
	  });



	  // do specific things based on page
	  if (document.querySelector('#index')) yellr.setUp.homepage();
	},

	// ask question if one has been pushed
	// ----------------------------
	askQuestion: function(question) {

		// notify user there is a new question
		// ----------------------------
		yellr.notificationNode.className = 'new-question';
		yellr.notificationNode.firstChild.innerHTML = '!';
		yellr.notificationNode.title = 'New question available!'

		// add new qustion to DOM
		// ----------------------------
		// based on user's language
		var text = yellr.language == 1 ? question.question_texts[0].question_text : question.question_texts[1].question_text;
		document.querySelector('#notification-msg p').innerHTML = text;
		
		// attach answer responses
		var answersList = document.querySelector('#question-answers');
		for (var i = 0; i < question.answer_values.length; i++) {
			var li = document.createElement('li');
			var label = document.createElement('label');
			var input = document.createElement('input');
					input.setAttribute('type', 'radio');
					input.setAttribute('name', 'answer');
					input.setAttribute('value', question.answer_values[i].answer_value);
			var span = document.createElement('span');
					span.innerHTML = question.answer_values[i].answer_text;

			// put it all together
			label.appendChild(input);
			label.appendChild(span);
			li.appendChild(label);
			answersList.appendChild(li);
		};


		// add inputs for media submissions
		// ----------------------------
		var extras = document.querySelector('#extra-fields');
		for (var i = 0; i < question.allowed_media.length; i++) {
			var type = question.allowed_media[i];

			var li = document.createElement('li');
			var label = document.createElement('label');
			var span = document.createElement('span');
			var input;

			if (type == 'text') {
				input = document.createElement('textarea');
			} else {
				input = document.createElement('input');
				input.setAttribute('type', 'file');
				input.setAttribute('name', 'media_payload');				
			}
		
			span.innerHTML = yellr.utils.capitalize(type);
			label.appendChild(span);
			label.appendChild(input);

			li.appendChild(label);
			extras.appendChild(li);
		};



		// click listener to toggle fields
		// ----------------------------
		document.querySelector('#more-details').onclick = function() {
			// change text
			if (this.innerHTML == 'Back') {
				// show orignal answers
				this.innerHTML = 'Add more details';
				document.querySelector('#question-answers').className = 'current';
				document.querySelector('#extra-fields').className = '';
			} else {
				// show extra fields
				this.innerHTML = 'Back';
				document.querySelector('#question-answers').className = '';
				document.querySelector('#extra-fields').className = 'current';
			}
		}


		// hide the extra field by setting the first one to .current
		answersList.className = 'current';

	}

};




yellr.setUp = {

	DOMreferences: function() {
		// where we will put the latest question
		yellr.questionNode = document.querySelector('#notification-msg');
		
		// the 'X' button for closing today's question
		yellr.questionClose = document.querySelector('#msg-close');
    $('#msg-close').on('click', function() {
    	// alert('wut');
    	// if ($('#notification-msg').class('show')) $('#notification-msg').toggleClass('show');
			// yellr.questionNode.className = yellr.questionNode.className ? '' : 'show';
    });

		// where we alert users of a new question
		yellr.notificationNode = document.querySelector('#notification-li');
		// show latest question
    $('#notification-li a').on('click', function() {
			// yellr.questionNode.className = yellr.questionNode.className ? '' : 'show';
    	// if ($('#notification-msg').class('show')) $('#notification-msg').toggleClass('show');

    });

    // $('.help-btn').on('click', function() {
    //     alert("Some help here...")
    // });

	},

	homepage: function() {
		// set initial values
		document.querySelector('#secondary-bar li').className = 'current';
		document.querySelector('#main-feed-wrapper ul').className = 'current';

		var tabs = document.querySelectorAll('#secondary-bar a');
		for (var i = 0; i < tabs.length; i++) {
			var tab = tabs[i];

			tab.onclick = function(e) {
				e.preventDefault();
				// update DOM node
				document.querySelector('#secondary-bar .current').className = '';
				this.parentNode.className = 'current';

				// update feed
				document.querySelector('#main-feed-wrapper ul.current').className = '';
				if (this.innerHTML.toLowerCase() == 'assignments') {
					document.querySelector('#latest-assignments').className = 'current';
				} else {
					document.querySelector('#latest-stories').className = 'current';
				}
			}
		};
	}
};











yellr.utils = {
	placeOffscreen: function(node) {
		// requires width & height to be set elsewhere
		var height = yellr.height;
		node.setAttribute('style', 'height: '+ height +'px; -webkit-transform: translateY(-'+ height + 'px); -ms-transform: translateY(-'+ height + 'px); -o-transform: translateY(-'+ height + 'px); transform: translateY(-'+ height + 'px)');
	},
	capitalize: function(string)
	{
		return string.charAt(0).toUpperCase() + string.slice(1);
		// src: https://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
	}
};