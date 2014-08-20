'use strict';
var mod = mod || {};

mod.new_question = (function () {


  var $form;


  var setup_form = function () {

    // render the form
    mod.utils.show_overlay({
      template: '#post-question-template'
    });

    // add event listeners
    // 1. close/cancel post
    // 2. onchange of language, show the actual fields

    // cached ref
    $form = $('#post-question-form');

    // 1.
    $form.find('#cancel-question-btn').on('click', function (e) {
      console.log('close this. no args');
      mod.utils.clear_overlay();
    });

    // 2.
    $form.find('#language-select').on('change', function (e) {
      mod.new_question.show_fields(this.value);
    });

  }

  var show_fields = function (language_code) {
    console.log('show fields. language: '+language_code);
  }




        // if question type is multiple_choice, show text inputs
        // else make sure it is hidden

        // $question_form.submit(function (e) {
        //   e.preventDefault();

        //   console.log('submit form');
        //   var url = 'http://yellrdev.wxxi.org/admin/create_question.json?token='+mod.TOKEN;
        //   console.log('url: '+url);

        //   // var fields = $question_form.serializeArray(),
        //   //     username = fields[0].value,
        //   //     password = fields[1].value;

        //   // // $question_form
        //   // $.ajax({
        //   //   type: 'POST',
        //   //   url: url,
        //   //   success: function (data) {
        //   //     if (data.success) {
        //   //       mod.TOKEN = data.token;
        //   //       mod.utils.save();
        //   //       window.location.href = 'http://127.0.0.1:8000/moderator/latest-submissions.html';
        //   //     } else {
        //   //       document.querySelector('#login-feedback').innerHTML = data.error_text;
        //   //     }
        //   //   },
        //   //   dataType: 'json'
        //   // });
        // })



  return {
    setup_form: setup_form,
    show_fields: show_fields
  }

})();
