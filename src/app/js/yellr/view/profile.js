'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.profile = (function() {

    /**
     * the user profile page for yellr
     */

    var render = function() {
      console.log('hello from: profile render');
      yellr.utils.no_subnav();
    }

    return {
      render: render
    }
})();
