'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.messages = (function() {

    /**
     * the user messages page for yellr
     */

    var render = function() {
      console.log('hello from: messages render');
      $('#homepage-subnav').hide();

    }

    return {
      render: render
    }
})();
