'use strict';
var yellr = yellr || {};


/*
  This object:
    - sets up our DOM
    - sets up our Cordova app plugins
*/ 


yellr.setup = {

	DOM: function() {
		/*
			set up the DOM
			mostly cosmetic things, caching DOM queries, setting up buttons
      ======================================================================
		*/


    /*
      the HTML uses <a> tags for app navigation
      they automatically change the hash
      when that happens we show the page
    */ 
    // can also call yellr.route('#page-id');
    // listen for <a> clicks
    window.onhashchange = yellr.route;


    // Page transitions
    // ===================================
    // var page_mgr = PageTransitions;
    // yellr.pageManager = page_mgr;
    // yellr.pageManager.init();



    $('#test_form').submit(function() {
      alert('posting form...');
      // form test
      $.post('http://yellr.mycodespace.net/uploadtest.json', $('#test_form').serialize(), function(response){
        console.log(response);
        alert(response);
      })
    });
    


    // Menu buttons
    // ===================================

    // home
    // $('#app-h1').on('tap', function(e) {yellr.route('#'); });
    // // notifications
    // $('#notifications-btn').on('tap', function(e) {yellr.route('#notifications'); });
    // // messages
    // $('#messages-btn').on('tap', function(e) {yellr.route('#messages'); });
    // // profile
    // $('#profile-btn').on('tap', function(e) {yellr.route('#profile'); });
    // // lowly ol' text
    $('#capture-text').on('tap', function() {yellr.route('#submit-form'); });



    // Swiping to navigate
    // ===================================
    
    // swipe left on assignments to view news-feed
    $('#assignments').on('swipeLeft', function() {yellr.route('#news-feed'); });
    // swipe right on news-feed to show assignments
    $('#news-feed').on('swipeRight', function() {yellr.route('#assignments'); });






		// setup buttons
		// ====================================

		// in app header --> show more options
    $('#more-btn').on('tap', function() {yellr.toggle.more_options(); });
    // switch between assignments and news feed
    $('#homepage-subnav').on('tap', function(e) {yellr.toggle.homepage(e); });
		// when submitting report --> show/add more details
    $('#submit-footer .flex').on('tap', function() {yellr.toggle.report_details(); });



		// set up app DOM references
		// ===================================
		yellr.app.setup({
			self: document.querySelector('#app'),
			header: document.querySelector('#header'),
			footer: document.querySelector('#footer')
		});

	},



	app: function() {
		/*
			set up the phone
			All the Cordova APIs should be set so we start using the phone's features
		*/
		

		// Language
		navigator.globalization.getPreferredLanguage(
			function(language) {
				
				// yellr.config.language.set(language.value); <-- use this later

				document.querySelector('#cordova-language').innerHTML = '' +
					'Language |' + language.value;
			},
			function() {
				// error
				document.querySelector('#cordova-language').innerHTML = '' +
					'Error getting language';
			}
		);


		
		// Device API feedback
		document.querySelector('#cordova-device').innerHTML = '' +
			'Device UUID     | ' + device.uuid + '<br/>'+
			'Device Platform | ' + device.platform + '<br/>'+
			'Device Model    | ' + device.model + '<br/>'+
			'Device Version  | ' + device.version + '<br/>'+
			'Device Cordova  | ' + device.cordova + '<br/>';

		// Connection type
		var networkState = navigator.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';
    document.querySelector('#cordova-connection').innerHTML = 'Connection type: ' + states[networkState];
	


    // Location API
    navigator.geolocation.getCurrentPosition(function(position) {
			// success geting location
			document.querySelector('#cordova-position').innerHTML = '' +
				'Latitude 					|' + position.coords.latitude + '<br />' +
				'Longitude 					|' + position.coords.longitude + '<br />' +
				'Altitude 					|' + position.coords.altitude + '<br />' +
				'Accuracy 					|' + position.coords.accuracy + '<br />' +
				'Altitude Accuracy 	|' + position.coords.altitudeAccuracy + '<br />' +
				'Heading 						|' + position.coords.heading + '<br />' +
				'Speed 							|' + position.coords.speed + '<br />' +
				'Timestamp 					|' + position.timestamp + '<br />';
    }, function(error) {
    	// error getting location
			document.querySelector('#cordova-position').innerHTML = '' +
	    	'Error Code 	|' + error.code + '<br/>' +
	      'Message 			|' + error.message;
    });



    // add extra Cordova events
    // ===================================
    document.addEventListener('pause', function() {
    	// when user opens a different app
    	// when this app goes into the background
    }, false);

    document.addEventListener('resume', function() {
    	// when the user comes back to this app
    }, false);

    document.addEventListener('online', function() {
    	// when the device connects to the internet
    }, false);

    document.addEventListener('offline', function() {
			// when the device loses its internet connection
    }, false);

    document.addEventListener('batterycritical', function(e) {
    	// critical battery low
    	document.querySelector('#cordova-battery').innerHTML = ''+
	    	'Battery Level Critical: ' + info.level + '<br/>' +
    		'Plugged In: ' + e.isPlugged;
    }, false);

    document.addEventListener('batterylow', function(e) {
    	// critical battery low
    	document.querySelector('#cordova-battery').innerHTML = ''+
	    	'Battery Level Critical: ' + info.level + '<br/>' +
    		'Plugged In: ' + e.isPlugged;
    }, false);



    // setup notifications
    // ===================================
		/* alert, confirm and prompt aren't working */
    $('#cordova-alert').on('tap', function() {
    	alert('test? 2');
    	navigator.notification.alert(
		    'You are the winner!',  // message
		    null,         // callback
		    'Game Over',            // title
		    'Done'                  // buttonName
			);
    });

  	$('#cordova-confirm').on('tap', function() {
			navigator.notification.confirm(
        'You are the winner!', // message
         null,            // callback to invoke with index of button pressed
        'Game Over',           // title
        'Restart,Exit'         // buttonLabels
	    );
    });

  	$('#cordova-prompt').on('tap', function() {
			navigator.notification.prompt(
        'Please enter your name',  // message
        onPrompt,                  // callback to invoke
        'Registration',            // title
        ['Ok','Exit'],             // buttonLabels
        'Jane Doe'                 // defaultText
	    );
  	});

  	$('#cordova-beep').on('tap', function() {
			navigator.notification.beep(1);
  	});

  	$('#cordova-vibrate').on('tap', function() {
			navigator.notification.vibrate(250);
  	});



  	// Media capture (audio, video, photo)
  	// ===================================
  	
  	// audio
  	$('#capture-audio').on('tap', function() {
  		navigator.device.capture.captureAudio(
  			function(audioFiles) {
  				alert('captured: ' + audioFiles.length + ' files');
  				var html = '';
  				for (var i = 0; i < audioFiles.length; i++) {
  					var path = audioFiles[i].fullPath;
  					var name = audioFiles[i].name;
  					html += name + ' | ' + path + '<br/>';
  				};
  				document.querySelector('#cordova-audio').innerHTML = html;
  			},
  			function(error) {
  				if (error.CAPTURE_NO_MEDIA_FILES) {
  					alert('nothing captured');
  				}
  				alert('closed without capturing audio');
  			}
  		);
  	});

  	// image
  	$('#capture-image').on('tap', function() {
  		navigator.device.capture.captureImage(
  			function(imageFiles) {
  				alert('captured ' + imageFiles.length + ' images');

  				var html = '';
  				for (var i = 0; i < imageFiles.length; i++) {
  					var name = imageFiles[i].name;
  					var path = imageFiles[i].fullPath;
  					html += name + ' | ' + path + '<br/>';
  				};
  				document.querySelector('#cordova-image').innerHTML = html;
  			},
  			function(erorr) {
  				alert('error taking picture');
  			}
  		);
  	});
    // long tap to select from camera roll
    $('#capture-image').on('longtap', function() {
      alert('long tap');
    });

  	
  	// video
  	$('#capture-video').on('tap', function() {
  		navigator.device.capture.captureVideo(
  			function(videoFiles) {
  				alert('Captured ' + videoFiles.length + ' videos');
  				var html = '';

  				for (var i = 0; i < videoFiles.length; i++) {
  					var name = videoFiles[i].name;
  					var path = videoFiles[i].fullPath;
  					html += name + ' | ' + path + '<br/>';
  				};
  				document.querySelector('#cordova-video').innerHTML = html;
  			},
  			function(error) {
  				alert('error taking video');
  			}
  		);
  	});


  	// // lowly ol' text
  	// $('#capture-text').on('tap', function() {
   //    yellr.pageManager.nextPage('#submit-form', 19);
  	// });



		// Upload files to server
		// function uploadFile(mediaFile) {
		//   var ft = new FileTransfer(),
		//       path = mediaFile.fullPath,
		//       name = mediaFile.name;

		//   ft.upload(path,
		//     "http://my.domain.com/upload.php",
		//     function(result) {
		//       console.log('Upload success: ' + result.responseCode);
		//       console.log(result.bytesSent + ' bytes sent');
		//     },
		//     function(error) {
		//       console.log('Error uploading file ' + path + ': ' + error.code);
		//     },
		//     { fileName: name }
		//    );
		// }


    // Extras
    // ----------------------------
    // FastClick.attach(document.body);




		// hide splash screen
		navigator.splashscreen.hide();

	}
};