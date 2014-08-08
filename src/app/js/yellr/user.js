'use strict';
var yellr = yellr || {};

yellr.user = (function() {

    // default settings
    var SETTINGS = {
      language: {
        code: 'en-US',
        name: 'English',
        set: function(lang) {
          // pass in a code from Cordova api
          this.code = lang;

          // decipher
          if (lang === 'en-US') this.name = 'English';  // *
          if (lang === 'es-US') this.name = 'Español';  // *
          if (lang === 'fr-US') this.name = 'French';   // *

          // * - from HTC Inspire (Android)
        }
      },
      app: {

      }
    }




    var init = function() {

      // give default settings
      yellr.SETTINGS = SETTINGS;

      // create a new user ID
      yellr.UUID = yellr.utils.guid();

    }





    var cordova = function() {
      /**
       * this gets called when Cordova has been initialized
       */
      console.log('cordova ready. setup user');
    }





    return {
      init: init,
      cordova: cordova
    }
})();
