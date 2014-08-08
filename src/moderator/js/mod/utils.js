'use strict';
var mod = mod || {};

mod.utils = {


    show_overlay: function (args) {

      var overlay = document.querySelector('#overlay-div-container');
      overlay.className = 'active';

      // listen for a close event
      overlay.onclick = mod.utils.clear_overlay;


      if (args.template) {
        this.render_template({
          template: args.template,
          context: args.context,
          target: overlay
        })
      }

    },



    clear_overlay: function (e) {
      if (e.target.id === 'overlay-div-container') {
        var overlay = document.querySelector('#overlay-div-container');
        overlay.className = '';
        overlay.removeEventListener('click', mod.utils.clear_overlay,false);
        return;
      }
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


      // get Handlebar template
      if (!settings.template || settings.template ==='') {
        $(settings.target).html(''); // if template is empty, clear HTML of target
        return;
      };
      var template = Handlebars.compile($(settings.template).html());

      // render it (check it we have a context)
      var html = template( settings.context ? settings.context : {} );

      // replace html, or return HTML frag
      if (settings.target) {
        // if (settings.append) $(settings.target).append(html);
        $(settings.target).html(html);
      }
      else return html;

    }
};


