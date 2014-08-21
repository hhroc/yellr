'use strict';
var mod = mod || {};

mod.new_assignment = (function () {


  var questions = [],
      $form,
      $preview_text,
      $questions_container,
      $question_form,
      $extra_fields,
      $cancel_btn,
      $save_btn,
      $post_btn;


  var setup_form = function () {

    // render the form
    mod.utils.show_overlay({
      template: '#new-assignment-template'
    });


    // get DOM refs
    $form         = $('#assignment-form'),
    $questions_container = $form.find('#questions-container'),
    $extra_fields = $form.find('#extra-assignment-fields'),
    $cancel_btn   = $form.find('#cancel-assignment'),
    $save_btn     = $form.find('#save-assignment'),
    $post_btn     = $form.find('#post-assignment');

    $preview_text = $('#question-text-preview');


    // hide things
    $form.find('.form-fields-list').hide();
    $extra_fields.hide();
    $save_btn.hide();
    $post_btn.hide();



    // add event listeners
    // 1. close/cancel post
    // 2. onchange of language, show form
    // 3. save draft btn


    // 1.
    $cancel_btn.on('click', function (e) {
      mod.utils.clear_overlay();
    });


    // 2.
    $form.find('#language-select').on('change', function (e) {
      mod.new_assignment.question_form(this.value);
    });


    // 3.
    $save_btn.on('click', function (e) {
      mod.new_assignment.save_draft();
    });



  }



  var question_form = function (language_code) {

    mod.utils.render_template({
      template: '#new-question-template',
      target: $questions_container,
      context: {
        language: language_code
      },
      append: true
    });


    $save_btn.show();
    $post_btn.show();
    $post_btn.text('Add Question');


    $question_form = $form.find('#'+language_code+'-question-form');


    // add event listeners
    $question_form.find('input[type="radio"]').on('change', function (e) {
      console.log(this.value);
    });


    $post_btn.on('click', function (e) {

      var url = 'http://yellrdev.wxxi.org/admin/create_question.json?token='+mod.TOKEN;

      $.ajax({
        type: 'POST',
        url: url,
        data: $question_form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (data.success) {
            console.log('SUCCESS');
            mod.new_assignment.successful_question_post(data);
          } else {
            console.log('FAIL');
            console.log(data);
          }
        }
      });

    });
  }


  var successful_question_post = function (data) {

    questions.push(data.question_id);

    // post-process things
    $preview_text.html($question_form.find('textarea').val())
    $preview_text.addClass('active');

    $post_btn.html('Post Assignment');
    $post_btn.off('click');
    $post_btn.on('click', function (e) {
      mod.new_assignment.post();
    });

    $extra_fields.show();
    console.log(questions);

  }


  var save_draft = function () {
    alert('save draft');
  }


  var post = function () {
    console.log('post the form');
  }



  return {
    setup_form: setup_form,
    question_form: question_form,
    successful_question_post: successful_question_post,
    post: post,
    save_draft: save_draft
  }

})();
