'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.view_collection = function () {

  // local vars
  // ----------------------------
  var items = [],
      // collection_id (from URL hash)
      collection_id = 0,
      // DOM references
      view_controls,
      export_btn,
      grid,
      // packery.js object
      pckry;


  // get the URL hash --> load the correct collection
  collection_id = parseInt(window.location.hash.split('#')[1]);

  // ping the server for that collection
  yellr.server.get_collection(collection_id, function (response) {

    // show collection name
    document.querySelector('.t1').innerHTML = response.collection_name;

    // render the collection items
    yellr.utils.render_template({
      template: '#view-collection-gi-template',
      target: '#collection-wrapper',
      context: {
        collection: response.collection
      },
      append: true
    });

    // setup grid
    items = document.querySelectorAll('.collection-gi');

    // delay packery so browser has time to render the new HTML
    setTimeout(function () {
      pckry = new Packery(grid, {
        itemSelector: '.collection-gi',
        // columnWidth: 60,
        columnWidth: '.collection-grid-sizer',
        gutter: '.gutter-sizer'
      });
    }, 500);

  });



  // send user a message / remove post from collection
  grid = document.querySelector('#collection-wrapper');
  grid.onclick = function (event) {
    if (event.target.className === 'fa fa-comment') {
      alert('Send message');
    } else if (event.target.className === 'fa fa-close') {
      alert('Remove item from collection');
    }
  }



  // download .zip file of media collection
  export_btn = document.querySelector('#export-content-btn');
  export_btn.onclick = function (event) {
    alert('TODO: Download zip file of media collection');
  }


  // [X] grid  or  [ ] list
  view_controls = document.querySelector('.collection-view-controls');
  // click to change view
  view_controls.onclick = function (event) {

    // for each case we either:
    //    1. reinitilize the packery grid, or
    //    2. destroy the packery grid
    // there are specific styles attached to each
    // so we loops through the grid items and change classNames

    if (event.target.checked) {
      if (event.target.defaultValue === 'list') {
        pckry.destroy();
        // change all classnames to '.gi'
        for (var i = 0; i < items.length; i++) items[i].className = 'gi';
      } else {
        // make sure items have class of '.collections-gi'
        for (var i = 0; i < items.length; i++) items[i].className = 'collection-gi';
        // reinitialize packery
        pckry = new Packery(grid, {
          itemSelector: '.collection-gi',
          // columnWidth: 60,
          columnWidth: '.collection-grid-sizer',
          gutter: '.gutter-sizer'
        });
      }
    }
  }


}
