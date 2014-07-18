'use strict';
var yellr = yellr || {};

/*
  Our app views

    view could be:
    - an event
    - a string

  called on hashchange, and yellr.route('#page-id')
*/

yellr.route = function(view) {


  /*
    1.  first we get the app's current state
    2.  then setup some handlebar vars
    3.  do stuff based on page hash
    4.  render it
  */


  /* 0 */
  // local shortcuts
  var render_template = yellr.utils.render_template;




  /* 1 */

  // the only vars we care about
  // ===================================
  var app = document.querySelector('#app'), // cached app ref
      current_state; // <body id="app" data-state="#">, the data-attr
  var hash, // hash tells us which page to show,  ex. #assignments
      id;   // ID is for showing a specific entry of that page  ex. #assignments/12312
  var src;  // this is a URL, or a passed in string




  /* 2 */

  // Handlebar templates
  // ===================================
  /* defaults */

  // header
  // templates: #main-header - #page-header - #submit-header
  // ----------------------------
  var header = {
    template: '#main-header',
    target: '#app-header',
    events: yellr.setup.more_options_toggle
  };


  // subnav
  // ----------------------------
  // templates: assignments/news-feed - inbox/sent/drafts
  var subnav = {
    template: '#report-bar',
    target: '#query-string',
  };


  // footer
  // ----------------------------
  // templates:  #report bar - #submit bar
  var footer = {
    template: '#report-bar',
    target: '#app-footer',
    events: yellr.setup.report_bar
  };


  var hasSubnav = false; // hide/show secondary nav




  /* 3 */

  // the logic
  // ===================================
  // the beginning
  if (typeof view === 'string') src = view;
  else src = window.location.hash;


  // get current app state
  current_state = app.getAttribute('data-state');

  // get the hash
  hash = src.split('/')[0];
  if (hash === '' || hash === '#') hash = '#assignments'; // default view: assignments

  // check for an ID
  id = src.split('/')[1];




  // do things for first run
  if (current_state === '#') {
    hasSubnav = true;
    $('#assignments-tab').addClass('current');
  }

  // check to make sure we're not repeating ourselves
  // ie. are we already on the page? if so, do nothing
  else if (current_state !== hash || id) {


    // do things based on hash
    switch (hash) {

      // Assignments
      // ===================================
      case '#assignments':

        // show all assignments
        // ----------------------------
        if (id === undefined) {
          hasSubnav = true;
        }


        // show single assignment
        // ----------------------------
        if (id) {
          header.template = '#page-header';
          header.context = {page: 'Assignment'};
          header.events = undefined;

          // find the right one first
          var assignments = JSON.parse(localStorage.getItem('assignments'));

          for (var i = 0; i < assignments.length; i++) {
            // careful, the 'id' var came fromt a string split
            if (assignments[i].id === parseInt(id)) {
              // we have a match
              yellr.parse.assignment(assignments[i], 'view');
              break;
            }
          }

          // change the hash to view-assignments
          hash = '#view-assignment'; // make sure we show/hide the right DOMs
          // change app state
          // app.setAttribute('data-state', hash);
        }
        break;


      // News Feed
      // ===================================
      case '#news-feed':
        hasSubnav = true;
        console.log('show news-feed');
        // show all reports
        // ----------------------------
        // show single report
        // ----------------------------
        break;
      case '#profile':
        // hasSubnav = false;
        header.template = '#page-header';
        header.context = {page: 'Profile'};
        header.events = undefined;
        console.log('show profile');
        break;
      case '#notifications':
        header.template = '#page-header';
        header.context = {page: 'Notifications'};
        header.events = undefined;
        console.log('show notifications');
        break;
      case '#messages':
        header.template = '#page-header';
        header.context = {page: 'Messages'};
        header.events = undefined;
        footer.template = '#messages-footer';
        footer.events = undefined;
        console.log('show messages');
        break;
      case '#submit-form':
        header.template = '#submit-header';
        header.events = yellr.setup.submit_form;
        footer.template = '#submit-footer';
        footer.events = undefined;
        console.log('show submit-form');
        break;
      case '#view-story':
        // this'll probably follow the schema of
        header.template = '#page-header';
        header.context = {page: 'View Story'};
        header.events = undefined;
        console.log('show view-story');
        break;
      default:
        header.template = '#main-header';
        footer.template = '#report-bar';
        footer.events = undefined;
    } // end switch statement


    // clear last class
    $('.pt-perspective .current').removeClass('current');
    // set new one
    // $(hash).addClass('current')

  }// end if...else

  $(hash).addClass('current');
  app.setAttribute('data-state', hash);



  /* 4 */

  // Making it look pretty (executes everytime)
  // ===================================

  // template stuff
  // ----------------------------
  render_template(header);
  render_template(footer);

  // details bro
  if (hasSubnav) $('#homepage-subnav').show();
  else $('#homepage-subnav').hide();


  if (typeof view === 'string') {
    window.location.hash = view;
    return;
  }

};
