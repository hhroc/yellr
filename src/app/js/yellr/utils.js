'use strict';
var yellr = yellr || {};

/**
 * utility functions
 * ===================================
 *
 * - render_template
 * - render_list
 * - clearNode
 */


yellr.utils = {

  save: function() {
    /**
     * Saves our yellr.localStorage
     * Updates our yellr.localStorage ref
     * THIS IS ONLY FOR LOCAL STORAGE
     */

    localStorage.setItem('yellr', JSON.stringify(yellr.localStorage));
    yellr.localStorage = JSON.parse(localStorage.getItem('yellr'));
    console.log('localStorage saved.');
  },

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
    var html = template( settings.context ? settings.context : {} );

    // replace html, or return HTML frag
    if (settings.target) $(settings.target).html(html);
    else return html;

    // add events
    if(settings.events) settings.events();
  },


  render_list: function(options) {
    if (!options.data || !options.target) {
      console.log('missing data or target');
      return;
    }

    // Handlebars compile into strings
    // so we'll be concatenating to this string
    var html = '';

    for (var i = 0; i < options.data.length; i++) {
      var asgmt = options.data[i];
      html += this.render_template({
        template: '#assignments-li',
        context: {
          id: asgmt.id,
          title: asgmt.title,
          contributions: asgmt.contributions.length,
          deadline: moment(asgmt.deadline).fromNow(true)
        }
      });
    };

    if (options.prepend) $(options.target).prepend(html);
    else if (options.append) $(options.target).append(html);
    else $(options.target).html(html);

    if (options.events) options.events();
  },

  render_assignment: function(settings) {
    // all we get is JSON
    // there are 2 hard-coded targets
    var data = settings.data;

    // render actual assignment
    this.render_template({
      template: '#assignment-view',
      target: '#view-assignment .assignment-view',
      context: {
        title: data.title,
        image: data.image,
        description: data.description,
        deadline: moment(data.deadline).fromNow(true)
      }
    })

  },

  clearNode: function(DOMnode) {
    while(DOMnode.hasChildNodes())
      DOMnode.removeChild(DOMnode.firstChild);
  },

  hash: function(s) {
    var hash = 0,
        i, l, char;
    if (s.length == 0) return hash;
    s += Math.random();
    for (i = 0, l = s.length; i < l; i++) {
      char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash && hash; // Convert to 32bit integer
    }
    var _s = hash.toString();
    if (_s.charAt(0) === '-') hash = _s.split('-')[1];
    return hash;
  }
};
