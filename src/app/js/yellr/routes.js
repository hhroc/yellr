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

      // index: assignments
      window.location.hash = '#assignments';

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
      yellr.route('#profile', yellr.view.profile);
      yellr.route('#news-feed', yellr.view.news_feed);
      yellr.route('#assignments', yellr.view.assignments);
      yellr.route('#notifications', yellr.view.notifications);
      yellr.route('#messages', yellr.view.messages);
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

      // get the hash
      var hash = window.location.hash;
      if (hash == '' || hash == '#') hash = '#assignments';

      // call the render function
      views[hash].render();

    }





    return {
      init: init,
      route: route,
      setup_routes: setup_routes,
      view: view
    }
})()
