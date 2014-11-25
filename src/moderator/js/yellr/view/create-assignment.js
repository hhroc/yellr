'use strict';
var yellr =  yellr || {};
    yellr.view = yellr.view || {};

yellr.view.create_assignment = function () {

  /*

    1   add extra language
    2   add survey answers
    3   geo-fence
    4   upload an image

    a.  cosmetic things
        - update classes onclick

    $1  Post the assignment
    $2  preview
    $3  save draft

  */



  // 1. add an extra language
  // ======================================================================
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





  // 2. when the user presses Enter, update the Survey answers list
  // ======================================================================
  document.querySelector('#survey-input').onkeypress = function (event) {
    if (event.keyCode === 13) {
      event.preventDefault();

      // make sure we have a value
      if (this.value !== '') {

        var answers = document.querySelectorAll('#survey-answers-list li');

        // remove the "None." <li> if it's there
        if (answers.length === 1 && answers[0].innerHTML === 'None.') {
          answers[0].parentNode.removeChild(answers[0]);
        }

        // limit of 8
        if (answers !== 8) {
          // create new <li>
          yellr.utils.render_template({
            template: '#new-survey-answer-template',
            target: '#survey-answers-list',
            context: {answer: this.value},
            append: true
          })

          // clear input
          this.value = '';
        } else {
          yellr.utils.notify('Max of 8 answers allowed.');
        }

      }

    }
  };





  // 3.
  document.querySelector('#image-upload').onclick = function (event) {
    console.log('hello from: ');
    $('#image-input').ajaxSubmit({
      url: yellr.URLS.upload,
      data: {
        client_id: yellr.TOKEN,
        media_type: 'image'
      },
      success: function (response) {
        console.log(response);
        if (response.success) {
          console.log('photo uploaded');
        } else {
          console.log('something went wrong');
        }
      }
    });

  }








  document.querySelector('#assignment-tabs').onclick = function (event) {
    // clear current element
    var current = document.querySelector('#assignment-tabs .current');

    if (current) {
      current.className = current.className.replace('current', '');
    }

    // set new element
    event.target.className += ' current';
  }











  // $2 preview
  // ======================================================================
  document.querySelector('#preview-btn').onclick = function (event) {
    // get form data
    var form = document.querySelector('.question-container form'),
        question_text = form.querySelector('.question_text').value,
        description = form.querySelector('.question_description').value;

    if (question_text === '') question_text = '[Empty]';

    // get DOM nodes
    var preview = document.querySelector('#preview');
    preview.querySelector('.preview-title').innerHTML = question_text;
    preview.querySelector('.preview-description').innerHTML = description;

  }




  // #1 post
  //    1.  first we validate our forms, make sure they;re not empty
  //    3.  then we post the things
  //
  // ======================================================================
  document.querySelector('#post-btn').onclick = function (event) {


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



}
