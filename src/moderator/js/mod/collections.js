'use strict';
var mod = mod || {};

mod.collections = (function() {



  var view_all = function () {
    console.log('hello from: view_all');

  }




  var init = function () {
    console.log('hello from: collections.init');
  }


  var view = function () {
    console.log('hello from: collections.view');
  }


  var setup_form = function () {
    console.log('hello from: setup_form');
    $('#new-collections-form').submit(function (e) {
      e.preventDefault();
      console.log('hello from: submit');
      mod.collections.submit_form();
    });

    $('#new-collections-form').find('.submit-btn').on('click', function () {
      console.log('submit the form');
      mod.collections.submit_form();
    })
  }


  var submit_form = function () {
    console.log('hello from: submit_form');
    console.log('url: ' + mod.URLS.create_collection);

    $.ajax({
      url: mod.URLS.create_collection,
      type: 'POST',
      dataType: 'json',
      data: $('#new-collections-form').serialize(),
      success: function (response) {
        if (response.success) {
          console.log('SUCCESS');
          console.log(response);
          mod.utils.clear_overlay();
        } else {
          console.log('something went wrong');
        }
      }
    })
  }



  return {
    init: init,
    view: view,
    view_all: view_all,
    setup_form: setup_form,
    submit_form: submit_form
  }
})();
