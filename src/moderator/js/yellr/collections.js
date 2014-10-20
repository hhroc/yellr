'use strict';
var mod = mod || {};

mod.collections = {


  setup_form: function () {
    console.log('hello from: setup_form');

    $('#new-collections-form').find('.submit-btn').on('click', function () {
      console.log('submit the form');
      mod.collections.submit_form();
    })
  },


  submit_form: function () {
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

};
