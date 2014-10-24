'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

// index.html

yellr.view.all_collections = function () {

  // get my collections
  yellr.server.get_my_collections(function () {

    // parse datetime with moment.js
    // add url attribute for Handlebar template peace of mind
    var collections = yellr.DATA.collections.filter(function (val, i ,arr) {
      val.collection_datetime = moment(val.collection_datetime).format('MMM Do YYYY');
      val.url = 'view-collection.html#'+val.collection_id;
      return true;
    });

    // render html
    yellr.utils.render_template({
      template: '#collections-gi-template',
      target: '.collections-grid',
      context: {collections: collections}
    });
  });


  // hook up the buttons
  document.querySelector('#new-collection-btn').onclick = function (e) {

    yellr.utils.show_overlay({template: '#collections-form-template'});
    yellr.collections.setup_form();

  }
  document.querySelector('#delete-collection-btn').onclick = function (e) {
    console.log('delete collection');
  }

}
