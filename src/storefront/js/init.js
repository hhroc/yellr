'use strict';
var yellr = yellr || {};


// the things
yellr.main = {

  init: function() {

    // check for pre-existing data, if none, create it
    if (localStorage.getItem('yellr-frontpage') === null) {
      yellr.utils.create_user();
      yellr.utils.save();
    } else {
      // we ave existing local storage, load it
      yellr.utils.load_localStorage();
    }
    // ----------------------------


    // get data-page attribute
    yellr.PAGE = document.querySelector('#storefront').getAttribute('data-page');


    // do things based on page
    switch (yellr.PAGE) {

      // homepage -> load latest stories
      case 'index':

        $.getJSON(yellr.URLS.stories, function (response) {

          if (response.success) {
            console.log(response);
            // yellr.utils.render_template({
            //   template: '#story-li-template',
            //   target: '#stories-list',
            //   context: {stories: response.stories }
            // });

          } else {
            console.log('something went wrong loading stories');
          }
        });
        break;
        // ----------------------------

      case 'article':
        document.querySelector('.published-datetime').innerHTML = moment(document.querySelector('.published-datetime').innerHTML, 'YYYY-MM-DD HH:mm:ss').format("MMM Do YYYY");
        break;
        // ----------------------------

      case 'about':
        var $form = $('#newsletter-form');
        $form.submit(function (e) {
          e.preventDefault;
          yellr.utils.email_signup($form.serealize());
        })

        break;
        // ----------------------------

      case 'submit-tip':

        // hide the submit-tip-btn
        document.querySelector('.submit-news-tip-btn').setAttribute('style','display:none;');

        // add extra media
        document.querySelector('#add-extra-media div.flex').onclick = function(e) {
          console.log('lol');
          if (e.target.nodeName === 'I' || e.target.nodeName === 'DIV') {
            var form_type = (e.target.nodeName === 'I') ? e.target.parentNode.className : e.target.className;
            // data.id = form_type.split('add-')[1].split(' ')[0];
            // self.setup_form(data, true);
            console.log(form_type.split('add-')[1].split(' ')[0]);
          }
        };


        // hook up the submit button
        document.querySelector('.submit-btn').onclick = function (e) {
          e.preventDefault();
          yellr.utils.submit_form();
        }

        break;

      default:
        console.log('lol ok');
        break;
    }

  }

};


window.onload = yellr.main.init;
