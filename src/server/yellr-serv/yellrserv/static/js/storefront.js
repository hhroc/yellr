/*!
 * yellr v0.0.1 (http://hhroc.github.io/)
 * Copyright 2014 hhroc - Hacks and Hackers Rochester
 * Licensed under MIT (https://github.com/hhroc/yellr/blob/master/LICENSE)
 */


'use strict';
var yellr = yellr || {};


// the things
yellr.main = {

  init: function() {

    // get data-page attribute
    yellr.PAGE = document.querySelector('#storefront').getAttribute('data-page');

    switch (yellr.PAGE) {

      case 'index':
        // load latest stories
        // var url = 'data/stories.json';
    // {0}/get_stories.json?client_id={1}&lat={2}&lng={3}&language_code={4}
    //     get_stories.json?client_id=1234&lat=43.3&lng=-77.5&language_code=en';
        var url = 'http://127.0.0.1:8080/get_stories.json?client_id=1234&lat=43.3&lng=-77.5&language_code=en';
        // var url = 'http://127.0.0.1:8080/get_stories.json?client_id='+yellr.UUID+'&lat='+yellr.+'&lng=-77.5&language_code=en';
        // var url = 'http://127.0.0.1:8080/get_stories.json?client_id=c26aee79-ed8d-479a-bcbc-a4445c7f3075&lat=43.3&lng=-77.5&language_code=en';
// c26aee79-ed8d-479a-bcbc-a4445c7f3075
        $.getJSON(url, function (response) {

          if (response.success) {

            console.log(response);

            yellr.utils.render_template({
              template: '#story-li-template',
              target: '#stories-list',
              context: {stories: response.stories }
            });

          } else {
            console.log('something went wrong loading stories');
          }
        });
        break;


      case 'article':
        console.log('hello from article');

        document.querySelector('.published-datetime').innerHTML = moment(document.querySelector('.published-datetime').innerHTML, 'YYYY-MM-DD HH:mm:ss').format("MMM Do YYYY");


        break;


      default:
        console.log('lol ok');
        break;
    }

  }

};


window.onload = yellr.main.init;

'use strict';
var yellr = yellr || {};


// the things
yellr.utils = {

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
