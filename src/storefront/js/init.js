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

      case 'about':
        console.log('setup email signup form');
        var $form = $('#newsletter-form');
        $form.submit(function (e) {
          e.preventDefault;
          yellr.utils.email_signup($form.serealize());
        })

        break;

      default:
        console.log('lol ok');
        break;
    }

  }

};


window.onload = yellr.main.init;
