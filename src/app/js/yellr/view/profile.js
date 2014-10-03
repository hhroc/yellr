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
      header.context = {page: yellr.SCRIPT.profile};
      render_template(header);

      yellr.utils.no_subnav();

      footer = data.template.footer;
      render_template(footer);

      document.querySelector('.username').innerHTML = yellr.SCRIPT.anonymous;
      document.querySelector('#unique-id').innerHTML = yellr.UUID;

      document.querySelector('.language-settings .t4').innerHTML = yellr.SCRIPT.language;
      document.querySelector('.account-settings .t4').innerHTML = yellr.SCRIPT.account;

      document.querySelector('#sign-in-btn').innerHTML = yellr.SCRIPT.sign_in;
      document.querySelector('#create-account-btn').innerHTML = yellr.SCRIPT.create_account;
      document.querySelector('#generate-new-uuid').innerHTML = yellr.SCRIPT.generate_new_uuid;

      document.querySelector('.client-version').innerHTML = yellr.VERSION.required_client_version;
      document.querySelector('.server-version').innerHTML = yellr.VERSION.server_version;



      this.add_eventlisteners();
      yellr.utils.setup_report_bar();

    }



    var add_eventlisteners = function() {

      // change language
      document.querySelector('.language-settings-list').onclick = function (e) {
        e.preventDefault();

        // target will be the <input>
        var target;
        if (e.target.nodeName === 'LI') {target = e.target.querySelector('input'); }
        else if (e.target.nodeName === 'INPUT' || e.target.nodeName === 'SPAN') {target = e.target.parentNode.querySelector('input'); }

        // do the thing
        if (target !== undefined && target.checked === false) {
          target.checked = true;
          yellr.utils.change_language(target.value);
        }
      }


      // generate new uid
      document.querySelector('#generate-new-uuid').onclick = function(e) {
        // get new GUID
        yellr.UUID = yellr.utils.guid();
        yellr.utils.save();
        console.log('TO DO: CLEAR ALL DATA WITH NEW UUID');
        // update text
        document.querySelector('#unique-id').innerHTML = yellr.UUID;
      }
      // change language
    }


    return {
      add_eventlisteners: add_eventlisteners,
      render: render
    }
})();
