'use strict';
var yellr = yellr || {};

yellr.routes = (function() {

    /**
     * routes.js
     *
     * exposes a Flask-like API that allows us
     * to call a view function based on the hash
     */

    var init = function() {

      // call the view function on hash change
      window.onhashchange = this.view;

      // provide route alias
      yellr.route = this.route;

      // hook up routes to view functions
      this.setup_routes();

      // start app on assignments list
      window.location.hash = (window.location.hash === '#assignments') ? '#' : '#assignments';

    }





    var setup_routes = function() {
      /**
       * our app routes
       *
       *
       * to add a new view/page:
       * - choose the hash
       * - create a new js file in js/yellr/view/
       *
       * ex: making the debug page
       *     html: make the HTML first
       *           turn it into a Handlebar template
       *           add new <div id='debug'> in app/html/index
       *           note- the container div for the page should have an id matching the hash
       *     hash: #debug
       *     file: js/yellr/view/debug.js
       *           note - the js filename should follow the hash
       *           #debug --> view/debug.js
       *
       *     init: add the new route to this function:
       *           yellr.route('#debug', yellr.view.debug)
       *           note - the js file should create a new object to view object
       */

      // yellr.view = {};
      yellr.route('#assignments', yellr.view.assignments);
      yellr.route('#view-assignment', yellr.view.assignments);
      yellr.route('#messages', yellr.view.messages);
      yellr.route('#news-feed', yellr.view.news_feed);
      yellr.route('#notifications', yellr.view.notifications);
      yellr.route('#profile', yellr.view.profile);
      yellr.route('#report', yellr.view.report);

    }





    var views = {}; // holds our views

    var route = function(hash, view) {
      /**
       * this function creates a 'private' object
       * that we can quickly call from the view function
       */

      views[hash] = view;

    }





    var view = function() {
      /**
       * this gets called on every hash change
       */

      // get the hash
      var hash = window.location.hash;
      if (hash == '' || hash == '#') hash = '#assignments';
      hash = hash.split('/')[0];

      // call the render function
      views[hash].render();

      // clear last class
      var previous_page = document.querySelector('.pt-perspective .current');
      if (previous_page !== null) previous_page.className = previous_page.getAttribute('data-classes');

      var next_page = document.querySelector(hash);
          next_page.setAttribute('data-classes', next_page.className);
          next_page.className += ' current';

    }





    return {
      init: init,
      route: route,
      setup_routes: setup_routes,
      view: view
    }
})()
