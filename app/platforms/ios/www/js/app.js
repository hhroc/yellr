(function () {
  /*
    We use an 'Immediate Function' 
    to initialize the application 
    to avoid leaving anything behind 
    in the global scope
  */


  // add sample data
  $.ajax({
    url: 'data/assignments.json',
    beforeSend: function( xhr ) {
      xhr.overrideMimeType( 'text/plain; charset=x-user-defined' );
    }
  })
  .done(function(data) {
    window.localStorage.setItem('assignments', data);
  });







  // LOCAL VARIABLES
  // ===================================


  var DOM = $('#main'); // where we actually append/remove
  // var slider = new PageSlider($('body'));




  // Templates
  // ----------------------------
  var templates = {
    page: {
      index: Handlebars.compile($('#page-index-tpl').html()),
      assignment: Handlebars.compile($('#page-assignment-tpl').html()),
      contribute: Handlebars.compile($('#contribution-form-tpl').html())
    },
    assignmentLI: Handlebars.compile($('#assignmentLI-tpl').html()),
    contributionLI: Handlebars.compile($('#contributionLI-tpl').html())
  };





  // URLs
  // ----------------------------
  var urls = {
    assignment: /^#assignment\/(\d{1,})/,
    contribution: /^#contribution\/(\d{1,})/,
    contribute: /^#contribute\/(\d{1,})/
  };





  // Views
  // ----------------------------
  var views = {

    // homepage
    index: function() {
      // render base html
      $('#main').html(templates.page.index());

      // add <li> elements
      var json = JSON.parse(window.localStorage.getItem('assignments'));
      $('#latest-assignments').html(templates.assignmentLI(json.assignments));
    },



    // assignment view
    assignment: function(id) {
      var json = JSON.parse(window.localStorage.getItem('assignments'));
          json = json.assignments; // dont't forget to do this

      // find the right assignment
      var assignment;
      for (var i = 0; i < json.length; i++) {
        if (json[i].id == parseInt(id)) {
          assignment = json[i];
          break;
        }
      };

      DOM.html(templates.page.assignment(assignment));

      // add latest contributions
      $('.contributions-list').html(templates.contributionLI);
    },



    // contribution view
    contribute: function(id) {
      id = parseInt(id); // string --> int
      // alert('report for Assignment #'+id);

      DOM.html(templates.page.contribute());










      // get location
      navigator.geolocation.getCurrentPosition(
        function(position) {
          // alert(position.coords.latitude + ',' + position.coords.longitude);
          
          // make it look nicer
          var latitude = formatPosition(position.coords.latitude.toString());
          var longitude = formatPosition(position.coords.longitude.toString());

          // formatPosition(latitude);

          $('#location').html(latitude + ', ' + longitude);
        },
        function() {
          alert('Error getting location');
        }
      ); // end geolocation



      //

    }
  };








  // EVENTS
  // ----------------------------
  document.addEventListener('deviceready', function () {

    // ios: remove delay for clicks
    FastClick.attach(document.body);

    // user system notification boxes
    if (navigator.notification) { // Override default HTML alert with native dialog
      window.alert = function (message) {
        navigator.notification.alert(
          message,    // message
          null,       // callback
          'Yellr',    // title
          'OK'        // buttonName
        );
      };
    }

    // hookup Audio/Video/Photo/Text input
    // ===================================
    // PICTURE
    $('#capture-picture').on('click', function(param) {
      event.preventDefault();
      if (!navigator.camera) {
        alert("Camera API not supported", "Error");
        return;
      }
      var options =   { 
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
        encodingType: 0     // 0=JPG 1=PNG
      };

      navigator.camera.getPicture(
        function(imageData) {
          // $('.employee-image', this.el).attr('src', "data:image/jpeg;base64," + imageData);
          alert('picture taken. trust me, bro');
        },
        function() {
          alert('Error taking picture', 'Error');
        },
        options
      );

      return false;
    });


    // VIDEO
    $('#capture-video').on('click', function() {
      event.preventDefault();

      // start video capture
      navigator.device.capture.captureVideo(function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
          path = mediaFiles[i].fullPath;
          alert(path);
          // do something interesting with the file
        }
      }, function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
      }, {limit:2});
      
      return false;
    });


    // AUDIO
    $('#capture-audio').on('click', function() {
      event.preventDefault();
      // alert('hahaha');

      // start audio capture
      navigator.device.capture.captureAudio(function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
          path = mediaFiles[i].fullPath;
          // do something interesting with the file
        }
      }, function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
      }, {limit:2});

      return false;
    });




    // load up the home page by default
    route();
  }, false);

  $(window).on('hashchange', route);






  // LOCAL FUNCTIONS
  // ----------------------------

  function route() {
    var hash = window.location.hash;

    if (!hash) {
      // index();
      views.index();
      return;
    }
    // var match = hash.match(urls.assignment);

    if (hash.match(urls.assignment)) views.assignment(hash.split('/')[1]);

    if (hash.match(urls.contribute)) views.contribute(hash.split('/')[1]);

    if (hash.match(urls.contribution)) {
      alert('view contribution');
    }
  }

  var formatPosition = function(string) {
    // only 6 decimal places plz
    var newString = string.split('.')[0];
    var decimals = string.split('.')[1];
        decimals.substring(0, 6);
    newString += '.' + decimals;

    return newString;
  }



}());