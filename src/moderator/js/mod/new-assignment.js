'use strict';
var mod = mod || {};

mod.new_assignment = (function () {


  var $form,
      $fields,
      $answers_wrapper,
      $add_question_btn;


  var setup_form = function () {

    // render the form
    mod.utils.show_overlay({
      template: '#new-assignment-template'
    });

    // get DOM refs
    $form             = $('#post-question-form'),
    $fields           = $form.find('.form-fields-list'),
    $answers_wrapper  = $form.find('.answers-input-wrapper'),
    $add_question_btn = $form.find('.submit-btn');


    // basic setup
    $fields.hide();
    $answers_wrapper.hide();


    // add event listeners
    // 1. close/cancel post
    // 2. onchange of language, show the actual fields
    // 3. preview btn
    // 4. save draft btn
    // 5. add fields if 'survey'


    // 1.
    $form.find('#cancel-question-btn').on('click', function (e) {
      mod.utils.clear_overlay();
    });

    // 2.
    $form.find('#language-select').on('change', function (e) {
      mod.new_assignment.show_fields(this.value);
    });

    // 3.
    $form.find('#preview-question').on('click', function (e) {
      mod.new_assignment.preview();
    });

    // 4.
    $form.find('#save-draft').on('click', function (e) {
      mod.new_assignment.save_draft();
    });

    // 5.
    $form.find('input[type="radio"]').on('change', function (e) {
      if (this.value === 'multiple_choice') $answers_wrapper.show();
      else $answers_wrapper.hide();
    });

  }



  var show_fields = function (language_code) {

    $fields.show();

    $add_question_btn.on('click', function (e) {
      e.preventDefault();
      console.log('adding question');
      var url = 'http://yellrdev.wxxi.org/admin/create_question.json?token='+mod.TOKEN;
      console.log('url: '+url);
      console.log($form.serialize());

      $.ajax({
        type: 'POST',
        url: url,
        data: $form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (data.success) {
            console.log('SUCCESS');
            console.log(data);
            alert('show overview page. allow users to add another lnguage. can submit if they want to');
            // mod.utils.clear_overlay();
          } else {
            console.log('FAIL');
            console.log(data);
          }
        }
      });

    });
  }


  var preview = function () {
    alert('hello from: preview_question');
  }


  var save_draft = function () {
    alert('save draft');
  }


  // $question_form.submit(function (e) {
  //   e.preventDefault();

  //   console.log('submit form');
  //   var url = 'http://yellrdev.wxxi.org/admin/create_question.json?token='+mod.TOKEN;
  //   console.log('url: '+url);

  //   // var fields = $question_form.serializeArray(),
  //   //     username = fields[0].value,
  //   //     password = fields[1].value;

  //   // $question_form
  //   $.ajax({
  //     type: 'POST',
  //     url: url,
  //     success: function (data) {
  //       if (data.success) {
  //         mod.TOKEN = data.token;
  //         mod.utils.save();
  //         window.location.href = 'http://127.0.0.1:8000/moderator/latest-submissions.html';
  //       } else {
  //         document.querySelector('#login-feedback').innerHTML = data.error_text;
  //       }
  //     },
  //     dataType: 'json'
  //   });
  // })



  return {
    setup_form: setup_form,
    show_fields: show_fields,
    preview: preview,
    save_draft: save_draft
  }

})();
