'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.assignments = (function() {

    /**
     * the user profile page for yellr
     */

    var render = function() {
      console.log('hello from: assignments render');
      // render the page

      // show assignments
      console.log('render assignments');

      /*

      load the data
      don't actually load it
      it should have been loaded already during init
      so you should actually use yellr.localStorage

       */
      // console.log(yellr.localStorage);

      // yellr.utils.render_list({
        //   data: data,
        //   target: '#latest-assignments',
        //   prepend: true
        // });
    }

    return {
      render: render
    }
})();
