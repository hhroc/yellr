// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

  // LOCAL VARIABLES
  // ----------------------------

  // templates
  var templates = {
    page: {
      index: Handlebars.compile($("#page-index-tpl").html())
    },
    assignmentLI: Handlebars.compile($("#assignmentLI-tpl").html())
  };


  var urls = {
    assignment: /^#assignment\/(\d{1,})/
  };

  // var slider = new PageSlider($('body'));

  var adapter = new LocalStorageAdapter();
  adapter.initialize().done(function () {
    // alert('yo');
  });



  /* --------------------------------- Event Registration -------------------------------- */
  document.addEventListener('deviceready', function () {

    FastClick.attach(document.body);

    if (navigator.notification) { // Override default HTML alert with native dialog
      window.alert = function (message) {
        navigator.notification.alert(
          message,    // message
          null,       // callback
          "Yellr",    // title
          'OK'        // buttonName
        );
      };
    }

    index();
  }, false);

  $(window).on('hashchange', route);

  /* ---------------------------------- Local Functions ---------------------------------- */


  function index() {
    // render base html
    $('#main').html(
      templates.page.index()
    );

    // add sample data
    $.ajax({
      url: 'data/assignments.json',
      beforeSend: function( xhr ) {
        xhr.overrideMimeType( "text/plain; charset=x-user-defined" );
      }
    })
    .done(function( data ) {
      alert('assignments.json loaded');
      var json = $.parseJSON(data);
      // $('#latest-assignments').html(templates.assignmentLI(json));
      $('#latest-assignments').html('<p>lololol</p>');
    });
  }



  function route() {
    var hash = window.location.hash;
    if (!hash) {
      console.log('render home screen');
      // slider.slidePage(new HomeView(adapter, homeTpl, employeeLiTpl).render().el);
      return;
    }
    var match = hash.match(detailsURL);
    if (match) {
      console.log('render new screen');
      // adapter.findById(Number(match[1])).done(function(employee) {
      //    // slider.slidePage(new EmployeeView(adapter, employeeTpl, employee).render().el);
      // });
    }
  }

}());