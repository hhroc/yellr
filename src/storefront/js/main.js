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
        var url = 'data/stories.json';

        $.getJSON(url, function (response) {

          console.log(response);

          if (response.success) {

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
