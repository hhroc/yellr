'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.debug = (function() {

    /**
     * View the app debug page.
     * If something goes wrong the users can send the info found on this page
     */

    var render_template = yellr.utils.render_template;
    var header, footer;




    var render = function(data) {

      header = data.template.header;
      footer = data.template.footer;


      render_template(header);
      render_template(footer);


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
          'Latitude           |' + position.coords.latitude + '<br />' +
          'Longitude          |' + position.coords.longitude + '<br />' +
          'Altitude           |' + position.coords.altitude + '<br />' +
          'Accuracy           |' + position.coords.accuracy + '<br />' +
          'Altitude Accuracy  |' + position.coords.altitudeAccuracy + '<br />' +
          'Heading            |' + position.coords.heading + '<br />' +
          'Speed              |' + position.coords.speed + '<br />' +
          'Timestamp          |' + position.timestamp + '<br />';
      }, function(error) {
        // error getting location
        document.querySelector('#cordova-position').innerHTML = '' +
          'Error Code   |' + error.code + '<br/>' +
          'Message      |' + error.message;
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



    }

    return {
      render: render
    }
})();
