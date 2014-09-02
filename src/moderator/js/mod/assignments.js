'use strict';
var mod = mod || {};

mod.assignments = (function() {


  var init = function () {
    console.log('hello from: assignments.init');
    console.log('look at all the assignments you\'ve posted');
  }

  var view = function () {
    console.log('hello from: assignments.view');
  }


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
    $form         = $('#assignment-form-wrapper'),
    $questions_container = $form.find('#questions-container'),
    $extra_fields = $form.find('#extra-assignment-fields'),
    $cancel_btn   = $form.find('#cancel-assignment-btn'),
    $save_btn     = $form.find('#save-assignment-btn'),
    $post_btn     = $form.find('#post-assignment-btn');

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
      mod.assignments.question_form(this.value);
    });


    // 3.
    $save_btn.on('click', function (e) {
      mod.assignments.save_draft();
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


    $post_btn.show();
    $post_btn.html('Add Question');


    // we render a form with the language code in the id
    // id="es-question-form", id="en-question-form"
    $question_form = $form.find('#'+language_code+'-question-form');


    // add event listeners
    $question_form.find('input[type="radio"]').on('change', function (e) {
      console.log(this.value);
    });


    $post_btn.on('click', function (e) {

      $.ajax({
        type: 'POST',
        url: mod.URLS.create_question,
        data: $question_form.serialize(),
        dataType: 'json',
        success: function (data) {
          if (data.success) {
            console.log('SUCCESS');
            // add the language code to the data object for our convenience
            data.language_code = language_code;
            mod.assignments.successful_question_post(data);
          } else {
            console.log('FAIL');
            console.log(data);
          }
        }
      });

    });
  }


  var successful_question_post = function (data) {

    // push the question ID to our array
    questions.push(data.question_id);

    // update preview text
    $preview_text.html($question_form.find('textarea').val())
    $preview_text.addClass('active');

    // hide form
    $question_form.hide();

    // hide language select
    $form.find('.language-select-wrapper').hide();

    $save_btn.show();

    $post_btn.html('Post Assignment');
    $post_btn.off('click');
    $post_btn.on('click', function (e) {
      mod.assignments.post();
    });

    $extra_fields.show();

    // // get the language text for each code
    // var language = '';
    // for (var i = 0; i < mod.LANGUAGES.length; i++) {
    //   if (mod.LANGUAGES[i].code === data.language_code) {
    //     language = mod.LANGUAGES[i].name;
    //     break;
    //   }
    // };


    // // the lanuage overview bullshit
    // var $languages_list = $extra_fields.find('#supported-languages');
    // var langs = $languages_list.find('li');

    // if (langs.length === 1) {

    //   // first run
    //   // prepend the thing
    //   $languages_list.prepend('<li class="default">'+language+'</li>');
    // } else {
    //   $languages_list.find('#add-language-btn').before('<li>'+language+'</li>');
    // }


    // // add a default language
    // // prepend

    // $languages_list.find('#add-language-btn').on('click', function (e) {
    //   console.log('hello from: ');
    //   $form.find('.language-select-wrapper').show();
    // })


  }


  var save_draft = function () {
    alert('save draft');
  }


  var post = function () {

    // calculate the amount of time in hours
    var amt = $form.find('#lifetime').val(),
        unit_type = $form.find('#unit-of-time-list input:checked').val();

    // we have to pass in hours
    // if days: X * 24
    // if months: x * 720 (24*30)
    var unit = (unit_type === 'days') ? 24 : 720;
    var total = amt * unit;

    $.ajax({
      type: 'POST',
      url: mod.URLS.publish_assignment,
      data: {
        'life_time': total,
        'questions': JSON.stringify(questions),
        'top_left_lat': 43.4,
        'top_left_lng': -77.9,
        'bottom_right_lat': 43.0,
        'bottom_right_lng': -77.3
      },
      dataType: 'json',
      success: function (response) {

        if (response.success) {
          console.log(response);
          mod.utils.clear_overlay();

          // clear array
          questions = [];
          alert('should redirect to the assignment');
        } else {
          alert('Something went wrong submitting an Assignment');
        }

      }
    });

  }



  return {
    init: init,
    view: view,
    setup_form: setup_form,
    question_form: question_form,
    successful_question_post: successful_question_post,
    post: post,
    save_draft: save_draft

  }
})();
