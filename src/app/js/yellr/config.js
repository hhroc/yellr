'use strict';
var yellr = yellr || {};

/*
  Default settings
*/

yellr.config = {
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
