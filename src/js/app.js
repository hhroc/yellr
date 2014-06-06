(function () {
  /*
    We use an 'Immediate Function' 
    to initialize the application 
    to avoid leaving anything behind 
    in the global scope
  */


  // LOCAL VARIABLES
  // ===================================


  var DOM = $('#main'); // where we actually append/remove
  // var slider = new PageSlider($('body'));



  // Templates
  // ----------------------------
  var templates = {
    page: {
      index: Handlebars.compile($('#page-index-tpl').html()),
      assignment: Handlebars.compile($('#page-assignment-tpl').html())
    },
    assignmentLI: Handlebars.compile($('#assignmentLI-tpl').html()),
    contributionLI: Handlebars.compile($('#contributionLI-tpl').html())
  };



  // URLs
  // ----------------------------
  var urls = {
    assignment: /^#assignment\/(\d{1,})/,
    contribution: /^#contribution\/(\d{1,})/,
    report: /^#report\/(\d{1,})/
  };



  // Views
  // ----------------------------
  var views = {
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

      // find the right assignment
      var assignment;
      for (var i = 0; i < json.length; i++) {
        if (json[i].id == id) {
          assignment = json[i];
          return;
        }
      };

      DOM.html(templates.page.assignment(assignment));
    }
  };









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


  // var adapter = new LocalStorageAdapter();
  // adapter.initialize().done(function () {
  //   // alert('yo');
  // });






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
    var match = hash.match(urls.assignment);

    if (hash.match(urls.assignment)) {
      // alert('view assignment');
      alert(hash.split('/')[1]);
      views.assignment(hash.split('/')[1]);
    }

    if (hash.match(urls.report)) {
      alert('submit report');
    }

    if (hash.match(urls.contribution)) {
      alert('view contribution');
    }
  }



}());