'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.report = (function() {

    /**
     * the user report page for yellr
     */

    var render = function() {
      console.log('hello from: report render');
      yellr.utils.no_subnav();
    }

    return {
      render: render
    }
})();
