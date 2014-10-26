'use strict';
var yellr =  yellr || {};
    yellr.view = yellr.view || {};

yellr.view.create_assignment = function () {


  // do the thing
  document.querySelector('#post-btn').onclick = function (event) {
    // do everything

    var forms = document.querySelectorAll('.question-container form'),
        type = document.querySelectorAll('#assignment-question-type input'),
        answers_list = document.querySelectorAll('#survey-answers-list li'),
        amt = document.querySelector('#lifetime').value,
        unit_type = document.querySelector('#unit-of-time-list input:checked').value,
        questions = [],
        answers = [],
        assignment_data = {},
        unit = (unit_type === 'days') ? 24 : 720;


    // publish every type of language form
    // ----------------------------
    // ----------------------------
    for (var i = 0; i < forms.length; i++) {

      // the basics
      var form_data = {
        language_code: forms[i].querySelector('input').value,
        question_text: forms[i].querySelector('.question_text').value,
        description: forms[i].querySelector('.question_description').value
      }

      // question type
      for (var k = 0; k < type.length; k++) {
        if (type[k].checked) form_data.question_type = type[k].value;
      };

      // get answers if needed
      if (form_data.question_type === 'multiple_choice') {
        // get all choices
        for (var j = 0; j < answers_list.length; j++) {
          answers.push(answers_list[j]);
        };

        form_data.answers = answers;
      }


      // post question to server
      // ----------------------------
      // ----------------------------
      yellr.server.create_question(form_data, function (question_response) {
        questions.push(question_response.question_id);

        if (questions.length === forms.length) {

          // we have to pass in hours
          // if days: X * 24
          // if months: x * 720 (24*30)
          assignment_data.life_time = amt * unit;
          assignment_data.questions = questions;

          // GET GEO-FENCE DATA
          // ----------------------------
          assignment_data.top_left_lat = 43.4;
          assignment_data.top_left_lng = -77.9;
          assignment_data.bottom_right_lat = 43.0;
          assignment_data.bottom_right_lng = -77.3;

          yellr.server.publish_assignment(assignment_data, function (assignment_response) {

            // get default_collection_id

            // create collection for the new assignment
            yellr.server.create_collection({
              name: 'Assignment #'+assignment_response.assignment_id+' Collection',
              description: 'Collection for #'+assignment_response.assignment_id,
              tags: 'some, example, collection tags'
            },function (collection_response) {

              // update our assignments
              yellr.server.get_my_assignments(function () {
                yellr.utils.redirect_to('view-assignment.html#'+assignment_response.assignment_id);
              });

            });
            // done creating collection for assignment

          })

        }
      })
    };





  }



  // survey or free-text?
  // ----------------------------
  document.querySelector('#assignment-question-type').onclick = function (event) {
    if (event.target.checked) {
      var tab = document.querySelector('.choices-tab');
      // toggle choices tab
      if (event.target.value === 'multiple_choice') {
        tab.className = tab.className.replace('faded', '');
      } else {
        // add .faded
        tab.className+= ' faded';
      }
    }
  }



  // multi-lingual assignments
  // ----------------------------
  document.querySelector('#language-select').onchange = function (event) {
    if (this.value !== '--') {
      // create another form
      yellr.utils.render_template({
        template: '#question-form-template',
        target: '.question-container',
        context: {
          language: this.value,
          language_code: this.value.toLowerCase().substring(0,2)
        },
        append: true
      });

      // update the <selectt>
      // remove node if down to last one
      for (var i = 0; i < this.options.length; i++) {
        if(this.options[i].value === this.value) {
          this.removeChild(this.options[i]);
          if (this.options.length === 1 ) {
            document.querySelector('#questions-container').removeChild(document.querySelector('.language-select-wrapper'));
          }
        }
      };
    }
  }













  // add event listeners
  // ----------------------------

  // // add an image to the question
  // var $image_input = $question_form.find('.add-photo-wrapper input[type="file"]');

  // $image_input.on('change', function (event) {
  //   console.log('upload image');

  //   $image_input.ajaxSubmit({
  //     url: yellr.URLS.upload,
  //     data: {
  //       client_id: yellr.TOKEN,
  //       media_type: 'image'
  //     },
  //     success: function (response) {
  //       console.log(response);
  //       if (response.success) {
  //         console.log('photo uploaded');
  //       } else {
  //         console.log('something went wrong');
  //       }
  //     }
  //   });
  // });


  // // when the user presses Enter, update the Survey answers list
  // $question_form.find('.question-answer-input').keypress(function (e) {

  //   if (e.which === 13) {
  //     e.preventDefault();
  //     // push the input to the array
  //     survey_answers.push($question_form.find('.question-answer-input').val());

  //     // update the HTML
  //     yellr.utils.render_template({
  //       template: '#new-survey-answer-template',
  //       target: '#survey-answers-list',
  //       context: {answer: $question_form.find('.question-answer-input').val() },
  //       append: true
  //     })

  //     // reset the form
  //     $question_form.find('.question-answer-input').val('');
  //     console.log(survey_answers);
  //   };
  // });



  // });


}
