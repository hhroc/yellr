'use strict';
var yellr = yellr || {};

/**
 * utility functions
 * ===================================
 *
 * - render_template
 * - load (ajax)
 * - clearNode
 */


yellr.utils = {

  render_template: function(settings) {
    /**
     * Dependencies: Handlebar.js, zepto.js (or jQuery.js)
     *
     * settings = {
     *   template: '#script-id',
     *   target: '#query-string',
     *   context: {},
     *   events: func
     * }
     */

    if (!Handlebars || !$) {
      // missing dependencies
      console.log('missing dependencies for yellr.utils.render_template');
      return;
    }

    // get Handlebar template
    var template = Handlebars.compile($(settings.template).html());

    // render it (check it we have a context)
    $(settings.target).html(template( settings.context ? settings.context : {} ))

    // add events
    if(settings.events) settings.events();
  },


  load: function(url, callback) {
    console.log('loading... ' + url);

    var request = null;
    if (window.XMLHttpRequest) request = new XMLHttpRequest();
    else if (window.ActiveXObject) request = new ActiveXObject('Microsoft.XMLHTTP');

    if (request !== null) {
      request.onreadystatechange = function() {
        // make sure request is Loaded
        if (request.readyState == 4) {
          // status code == OK (200)
          if (request.status == 200) {
            console.log('done loading.. ' + url, request);
            callback(request);
          }
        }
      }
      request.open('GET', url, true);  // true means non-blocking/asynchronous I/O
      request.send('');
    } else console.log('error loading: ' + url);
  },

  clearNode: function(DOMnode) {
    while(DOMnode.hasChildNodes())
      DOMnode.removeChild(DOMnode.firstChild);
  }
};
