'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.profile = (function() {

    /**
     * the user profile page for yellr
     */

    var render_template = yellr.utils.render_template;
    var header, footer;



    var render = function(data) {

      /**
       * get the hash (single or feed view?)
       */


      header = data.template.header;
      header.template = '#page-header';
      header.context = {page: 'Profile'};

      footer = data.template.footer;


      render_template(header);
      render_template(footer);
      yellr.utils.no_subnav();

      document.querySelector('#username').innerHTML = yellr.UUID;

      this.add_eventlisteners();
      yellr.utils.setup_report_bar();

    }



    var update = function() {
      console.log('new data availble...');
      console.log('...check if it is new/different');
    }




    var add_eventlisteners = function() {
      // refresh button
      document.querySelector('#refresh-btn').onclick = function(e) {
        console.log('load profile data');
        console.log('spin the thing to show we\'re loading something');
        yellr.data.load_profile(yellr.UUID, this.update);
      }


      // generate new uid
      document.querySelector('#generate-new-uuid').onclick = function(e) {
        console.log('old uuid: '+ yellr.UUID);
        yellr.UUID = yellr.utils.guid();
        console.log('new uuid: '+ yellr.UUID);

        console.log('TO DO: CLEAR ALL DATA WITH NEW UUID');

        yellr.utils.save();
      }
      // change language
    }


    return {
      add_eventlisteners: add_eventlisteners,
      render: render,
      update: update
    }
})();
