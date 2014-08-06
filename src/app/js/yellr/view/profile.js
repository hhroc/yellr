'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.profile = (function() {

    /**
     * the user profile page for yellr
     */

    var render = function() {
      console.log('hello from: profile render');
      $('#homepage-subnav').hide();
    }

    return {
      render: render
    }
})();
