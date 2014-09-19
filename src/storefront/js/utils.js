'use strict';
var yellr = yellr || {};


// the things
yellr.utils = {

  email_signup: function (formData) {
    console.log('hello from: email_signup');
    console.log('missing url');

    // $.ajax({
    //   url: 'tbd',
    //   type: 'POST',
    //   dataType: 'json',
    //   data: formData,
    //   success: function (response) {
    //     console.log(response);
    //   }
    // })
  },


  render_template: function(settings) {
    /**
     * Dependencies: Handlebar.js, zepto.js (or jQuery.js)
     *
     * settings = {
     *   template: '#script-id',
     *   target: '#query-string',
     *   context: {}
     * }
     */

    if (!Handlebars || !$) {
      // missing dependencies
      console.log('missing dependencies for yellr.utils.render_template');
      return;
    }

    // get Handlebar template
    if (!settings.template || settings.template ==='') {
      // if template is empty, clear HTML of target
      $(settings.target).html('');
      return;
    };
    var template = Handlebars.compile($(settings.template).html());

    // render it (check it we have a context)
    var html = template( settings.context ? settings.context : {} );

    // replace html, or return HTML frag
    if (settings.append) $(settings.target).append(html);
    else if (settings.prepend) $(settings.target).prepend(html);
    else $(settings.target).html(html);

  }

};
