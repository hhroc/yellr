'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.notifications = (function() {

    /**
     * the user notifications page for yellr
     */

    var render = function() {
      console.log('hello from: notifications render');
      yellr.utils.no_subnav();
    }

    return {
      render: render
    }
})();
