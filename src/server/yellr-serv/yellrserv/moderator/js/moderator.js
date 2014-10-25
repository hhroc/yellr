'use strict';
var yellr = yellr || {};

// initial settings
yellr.BASE_URL = '/';
yellr.AUTO_REFRESH = true;


window.onload = function () {

    // Handlebars check
    // -----------------------------
    if (!Handlebars || !$) {
      console.log('missing dependencies for yellr.utils.render_template');
      return;
    }
    // ----------------------------


    var body, page, sidebar;


    // check for pre-existing data, if none, create it
    if (localStorage.getItem('yellr-mod') === null) yellr.utils.redirect_to_login();
    else yellr.utils.load_localStorage();

    // make sure we have our DATA object setup
    if (yellr.DATA === undefined) yellr.DATA = {};


    // get our current page
    body = document.querySelector('body');
    page = body.getAttribute('data-page');

    // do specfic things for each page
    switch (page) {
      case 'index':
        // the dashboard and everything
        yellr.view.index.init();
        break;
      case 'login':
        yellr.view.login();
        break;
      case 'create-assignment':
        yellr.view.create_assignment();
        break;
      case 'assignments':
        yellr.view.all_assignments();
        break;
      case 'single-assignment':
        yellr.view.view_assignment();
        break;
      case 'write-article':
        yellr.view.write_article();
        break;
      case 'collections':
        yellr.view.all_collections();
        break;
      case 'single-collection':
        yellr.view.view_collection();
        break;
      case 'messages':
        yellr.view.inbox();
        break;
      default:
        console.log('lol ok');
        break;
    }


    // hookup the Yellr admin sidebar
    sidebar = document.querySelector('#sidebar');
    if (sidebar) {
      // logout button
      document.querySelector('#logout-btn').onclick = function (event) {
        yellr.utils.logout();
      };

      // cosmetic things
      // - make sure the sidebar takes up the whole screen
      if(body.scrollHeight > sidebar.scrollHeight) sidebar.setAttribute('style', 'min-height: '+body.scrollHeight+'px');

    }



}

'use strict';
// var mod = mod || {};

yellr.assignments = (function() {

  // 'global' vars
  var questions = [],
      survey_answers = [],
      supported_languages = [],
      $form,
      $preview_text,
      $questions_container,
      $question_form,
      $question_textarea,
      $extra_fields,
      $preview_btn,
      $cancel_btn,
      $save_btn,
      $post_btn;


      // // setup the action buttons for each resposne
      // $('#assignment-replies-list').on('click', function (e) {
      //   switch (e.target.className) {
      //     case 'fa fa-plus':
      //       // get the DOM references
      //       var postNode = e.target.parentNode.parentNode.parentNode.querySelector('.meta-div'),
      //           collectionNode = document.querySelector('#assignment-collection-list');

      //       // add post to collection
      //       yellr.collections.add_post_to_collection(postNode, collectionNode);
      //       break;

      //     case 'fa fa-comment':
      //       console.log('write a message');
      //       var uid = e.target.offsetParent.querySelector('.meta-div').getAttribute('data-uid')
      //       yellr.messages.create_message(uid, 'RE: Recent post on Yellr');
      //       break;
      //     case 'fa fa-flag':
      //       console.log('mark as ain appropriate');
      //       break;
      //     case 'fa fa-trash':
      //       console.log('discard this reply');
      //       break;
      //     default:
      //       break;
      //   }
      // });




  var view = function (assignment_id) {

    // load that assignment from localStorage
    var assignment = yellr.DATA.assignments.filter(function (val, i, arr) {
      if (val.assignment_id === assignment_id) return true;
    })[0];

    // render the Handlebars template
    yellr.utils.render_template({
      template: '#assignment-overview-template',
      target: '#view-assignment-section',
      context: {assignment: assignment}
    });

  }




  var setup_form = function () {

    // render the form
    yellr.utils.show_overlay({
      template: '#new-assignment-template'
    });


    // get DOM refs
    $form         = $('#assignment-form-wrapper'),
    $questions_container = $form.find('#questions-container'),

    // fields for: deadline, setting default language
    $extra_fields = $form.find('#extra-assignment-fields'),

    // action buttons
    $cancel_btn   = $form.find('#cancel-assignment-btn'),
    $preview_btn = $form.find('#preview-assignment-btn'),
    $save_btn     = $form.find('#save-assignment-btn'),
    $post_btn     = $form.find('#post-assignment-btn'),
    $preview_text = $('#question-text-preview');


    // hide things
    $form.find('.form-fields-list').hide();
    $extra_fields.hide();
    $preview_btn.hide();
    $save_btn.hide();
    $post_btn.hide();


    // add event listeners
    // 1. close/cancel post
    // 2. onchange of language, show form
    // 3. save draft btn
    // 4. preview the full assignment


    // 1.
    $cancel_btn.on('click', function (e) {
      yellr.utils.clear_overlay();
    });


    // 2.
    $form.find('#language-select').on('change', function (e) {
      if (this.value !== '--') yellr.assignments.create_question_form(this.value);
    });


    // 3.
    $save_btn.on('click', function (e) {
      yellr.assignments.save_draft();
    });

    // 4.
    $preview_btn.on('click', function (event) {
      console.log('preview assignment');
      yellr.assignments.preview_assignment();
    });


  }



  var create_question_form = function (language_code) {

    $extra_fields.hide();
    $preview_text.removeClass('active');

    // create a new question form based on the language selected
    yellr.utils.render_template({
      template: '#new-question-template',
      target: $questions_container,
      context: {
        language: language_code
      }
    });

    // we render a form with the language code in the id
    // id="es-question-form", id="en-question-form"
    $question_form = $form.find('#'+language_code+'-question-form');
    $question_form.find('.answers-input-wrapper').hide();



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


    // choose between a Free Response or Survey
    $question_form.find('input[type="radio"]').on('change', function (e) {

      if (this.value === 'multiple_choice') $question_form.find('.answers-input-wrapper').show();
      else $question_form.find('.answers-input-wrapper').hide();

    });

    // when the user presses Enter, update the Survey answers list
    $question_form.find('.question-answer-input').keypress(function (e) {

      if (e.which === 13) {
        e.preventDefault();
        // push the input to the array
        survey_answers.push($question_form.find('.question-answer-input').val());

        // update the HTML
        yellr.utils.render_template({
          template: '#new-survey-answer-template',
          target: '#survey-answers-list',
          context: {answer: $question_form.find('.question-answer-input').val() },
          append: true
        })

        // reset the form
        $question_form.find('.question-answer-input').val('');
        console.log(survey_answers);
      };
    });


    // update the preview text on user input
    $question_textarea = $question_form.find('#question_textarea');
    $question_textarea.on('keyup', function (e) {
      $preview_text.html($question_textarea.val());
      if ($question_textarea.val() === '') $preview_text.html('Ask the community...');
    });
    // [default text]
    $preview_text.html('Ask the community...');



    // show the post button
    $post_btn.show();
    $post_btn.html('Add Question');
    $post_btn.off('click');
    $post_btn.on('click', function (e) {

      // console.log($question_form.serialize()+'&answers='+JSON.stringify(survey_answers));
      // alert('testing out survey answers');

      $.ajax({
        type: 'POST',
        url: yellr.URLS.create_question,
        data: $question_form.serialize()+'&answers='+JSON.stringify(survey_answers),
        dataType: 'json',
        success: function (response) {
          if (response.success) {
            console.log('SUCCESS');
            // update our supported languages
            supported_languages.push(language_code)
            yellr.assignments.successful_question_post(response);
          } else {
            console.log('FAIL');
            console.log(response);
          }
        }
      });

    });
  }


  var successful_question_post = function (data) {

    // push the question ID to our array
    questions.push(data.question_id);

    // update preview text
    $preview_text.html($question_textarea.val());
    $preview_text.addClass('active');

    // hide form
    $question_form.hide();

    // hide language select
    $form.find('.language-select-wrapper').hide();

    $save_btn.show();
    $preview_btn.show();

    $post_btn.html('Post Assignment');
    $post_btn.off('click');
    $post_btn.on('click', function (e) {
      yellr.assignments.post();
    });

    $extra_fields.show();


    this.language_feedback();

  }



  var language_feedback = function () {

    // give the user feedback on the languages the current assignment supports

    // get the languages the question supports compared to what yellr supports
    var languages = yellr.DATA.languages.filter(function (val, i, array) {
      for (var j = 0; j < supported_languages.length; j++) {
        if (val.code === supported_languages[j]) {
          return true;
        }
      };
    });


    yellr.utils.render_template({
      target: '#supported-languages',
      template: '#language-support-template',
      context: {languages: languages}
    });

    // users can still add different languages
    // we remove the ones that they have already done to prevent duplicates
    $('#language-select').find('option[value="'+supported_languages[supported_languages.length-1]+'"]').remove();

    $('#add-language-btn').on('click', function (e) {
      $('#assignment-form-wrapper .language-select-wrapper').show();
    })

  }



  var preview_assignment = function () {
    console.log('do some css things to hide this and show that');
  }



  var save_draft = function () {
    alert('save draft. NOT IMPLEMENTED. THIS DOES NOTHING LOL');
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
      yellr: mod.URLS.publish_assignment,
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

          // create a collection for the assignment
          $.ajax({
            url: yellr.URLS.create_collection,
            type: 'POST',
            dataType: 'json',
            data: {
              name: 'Assignment #'+response.assignment_id+' Collection',
              description: 'Collection for #'+response.assignment_id,
              tags: 'some, example, collection tags'
            },
            success: function (_response) {
              if (_response.success) {
                // clear array
                questions = [];
                yellr.utils.clear_overlay();
              } else console.log('something went wrong creating a collection for this assignment');
            }
          }).done(function () {

            // update our assignments
            yellr.assignments.get_my_assignments({
              callback: function () {
                yellr.utils.redirect_to('view-assignment.html#'+response.assignment_id);
              }
            });

          });
          // done creating collection for assignment


        } else {
          alert('Something went wrong submitting an Assignment');
        }
      }

    });

  }


  return {
    view: view,
    setup_form: setup_form,
    create_question_form: create_question_form,
    successful_question_post: successful_question_post,
    post: post,
    save_draft: save_draft,
    preview_assignment: preview_assignment,
    language_feedback: language_feedback
  }
})();

'use strict';
var mod = mod || {};

mod.feed =  {

  toggle_collections_dropdown: function (target) {

    if ($(target.parentNode).hasClass('dropdown-container'))
      mod.feed.hide_collections_dropdown(target);
    else mod.feed.show_collections_dropdown(target);

  },



  show_collections_dropdown: function (target) {
    // we are here --> <i class="fa fa-thing"></i>
    // we want the parent <li> to start


    $(target.parentNode).addClass('dropdown-container');

    mod.utils.render_template({
      template: '#collections-dropdown-template',
      target: target.parentNode,
      context: {collections: mod.DATA.collections},
      append: true
    });

    $(target.parentNode).find('.collections-dropdown').on('click', function (e) {
      mod.feed.add_post_to_collection_from_feed(e.target)
    })
  },



  hide_collections_dropdown: function (target) {

    $(target.parentNode).removeClass('dropdown-container');

    mod.utils.render_template({
      template: '',
      target: $(target.parentNode).find('.collections-dropdown')
    });
  },



  add_post_to_collection_from_feed: function (target) {

    // we're in pretty deep with the DOM, need to get out
    var $gi = $(target.offsetParent.offsetParent.parentNode.parentNode.parentNode),
        post_id = $gi.find('.meta-div').data('post-id'),
        collection_id = $(target).data('collection-id');

    mod.collections.add_post_to_collection(post_id, collection_id, function (result) {
      if (result) {
        // this is a quick hack
        // should use a CSS class instead
        target.parentNode.style.opacity = '0.3';
        // target.parentNode.className = 'faded';
      };
    });

  }








    // DRAG AND DROP
    //
    // moderator.drag = function(e, element) {
    //   // console.log(e);
    //   console.log(e.dataTransfer);
    //   // e.dataTransfer.setData("Text", ev.target.id);
    // }
    // moderator.allowDrop = function(e, element) {
    //   e.preventDefault();
    //   console.log(e);
    //   console.log(this);
    //   // this.style.background = 'tomato';
    // }
    // moderator.drop = function(e, element) {
    //   ev.preventDefault();
    //   var data = ev.dataTransfer.getData("Text");
    //   ev.target.appendChild(document.getElementById(data));
    // }


    // // drag and drop an item onto the collections nav link
    // var drop_target = document.querySelector('#collections-li');
    // drop_target.ondragover = function(e) {
    //   // moderator.allowDrop(e);
    //   e.preventDefault();
    //   // console.log(e);
    //   // console.log(this);
    //   this.style.background = 'tomato';
    // }
    // drop_target.ondragleave = function(e) {
    //   e.preventDefault();
    //   this.style.background = 'transparent';
    // }
    // drop_target.ondrop = function(e) {
    //   e.preventDefault();
    //   this.style.background = 'blue';
    //   console.log('story id: ', e.dataTransfer.getData('story_id'));
    // }

};

moderator.filter = {

  settings: {
    source_type: 'all',
    media_types: ['video', 'photo', 'audio', 'text'],
    text: ''
  },

  init: function(options) {

    // cache the grid
    moderator.submissions_grid = options.grid.querySelectorAll('.story-item');

    // setup event listeners
    var filterForm = document.querySelector('.filter-form');
        filterForm.querySelector('#filter-submission-type').onclick = this.submission_type;
        filterForm.querySelector('#filter-content-type').onclick = this.content_type;
        filterForm.querySelector('#filter-search').onkeyup = this.search;
  },

  submission_type: function(e) {
    if (e.target.tagName == 'INPUT') {
      // update settings
      moderator.filter.settings.source_type = e.target.value;
      // make call
      moderator.filter.grid({
        array: moderator.submissions_grid,
        settings: moderator.filter.settings
      });
    }
  },

  content_type: function(e) {
    if (e.target.tagName == 'INPUT') {
      // loop through other checkboxes,
      // checked values, should be shown
      var show_types = [];
      var parent = e.target.parentNode.parentNode;

      var inputs = parent.querySelectorAll('input[type="checkbox"]');
      for (var i = 0; i < inputs.length; i++) {
        var type = inputs[i];
        if (type.checked) {
          show_types.push(type.value);
        }
      }

      // update settings
      moderator.filter.settings.media_types = show_types;
      // make the call
      moderator.filter.grid({
        array: moderator.submissions_grid,
        settings: moderator.filter.settings
      });
    }
  },
  search: function(e) {
    // update settings
    moderator.filter.settings.text = e.target.value.toLowerCase();
    // make call
    moderator.filter.grid({
      array: moderator.submissions_grid,
      settings: moderator.filter.settings
    });
  },

  grid: function(config) {
    // config should have:
    // - grid: array of things
    // - settings: obj
    for (var i = 0; i < config.array.length; i++) {
      var item = config.array[i];
      var meta = item.querySelector('.meta-div');

      // clear filtered-out classname
      var classes = item.className;
      item.className = classes.split('filtered-out')[0];

      // FILTER SOURCE TYPE
      // ----------------------------
      // if value is not 'All', filter it
      if (config.settings.source_type !== 'all') {
        if (meta.getAttribute('data-source') !== config.settings.source_type) {
          item.className += ' filtered-out';
        }
      }

      // FILTER MEDIA TYPE
      // ----------------------------
      var media_type = meta.getAttribute('data-type');
      // console.log(media_type, config.settings.media_types);
      var match = false;
      for (var j = 0; j < config.settings.media_types.length; j++) {
        var type = config.settings.media_types[j];
        if (media_type == type) {
          match = true;
          break;
        }
      }
      if (!match) {
        item.className += ' filtered-out';
      }

      // FILTER BY TEXT
      // ----------------------------
      var regex = new RegExp(moderator.filter.settings.text);

      var description = item.querySelector('.description').innerHTML.toLowerCase();

      // this if statement seems backwards,
      // but that's how it works, so idk
      if (description.search(regex))
        item.className += ' filtered-out';

    } // end for...loop
    // we now know which elements to filter out

    // prep the grid
    moderator.packery.reloadItems();

    var filtered = document.querySelectorAll('.filtered-out');
    for (var j = 0; j < filtered.length; j++) {
      moderator.packery.remove(filtered[j].parentNode);
    };
    // console.log(config.array[0]);
    // console.log(moderator.packery);
    moderator.packery.layout();
  }

}

'use strict';
var yellr = yellr || {};

// This holds all the server calls for the Moderator side
// ===================================

yellr.server = {


  // get a user admin token
  //  - admin/get_access_token.json
  // ----------------------------
  login: function (username, password, callback) {

    // SET THE URLS HERE NOW THAT WE HAVE A USERNAME AND PASSWORD
    var url = yellr.BASE_URL+'admin/get_access_token.json?user_name='+username+'&password='+password;

    // $form
    $.ajax({
      type: 'POST',
      url: url,
      dataType: 'json',
      success: function (data) {
        if (callback) callback(data);

        if (data.success) {
          yellr.TOKEN = data.token;
          yellr.utils.save();
          yellr.utils.set_urls();

          yellr.server.get_languages(function (response) {
            if (response.success) yellr.utils.redirect_to('index.html');
          });
        }
      }
    });

  },


  // get available languages
  //  - admin/get_languages.json
  // ----------------------------
  get_languages: function (callback) {

    $.ajax({
      url: yellr.URLS.get_languages,
      type: 'POST',
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          yellr.DATA.languages = response.languages;
          yellr.utils.save();
          if (callback) callback(response);
        } else {
          yellr.utils.redirect_to_login();
        }
      }
    });

  },



  // language_code
  // question_text
  // description
  // question_type
  // answers
  create_question: function (data, callback) {

    // stringify some things
    if (data.answers) data.answers = JSON.stringify(data.answers);

    // post
    $.ajax({
      type: 'POST',
      url: yellr.URLS.create_question,
      data: data,
      // data: $question_form.serialize()+'&answers='+JSON.stringify(survey_answers),
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          if (callback) callback(response);
        }
      }
    });

  },


  publish_assignment: function (data, callback) {

    // NOT WORKING

    // data: {
    //   'life_time': total,
    //   'questions': questions (array),
    //   'top_left_lat': 43.4,
    //   'top_left_lng': -77.9,
    //   'bottom_right_lat': 43.0,
    //   'bottom_right_lng': -77.3
    // },

    data.questions =JSON.stringify(data.questions);

    $.ajax({
      type: 'POST',
      url: yellr.URLS.publish_assignment,
      data: data,
      dataType: 'json',
      success: function (response) {
        console.log(response);
        if (response.success) {
          if (callback) callback(response);
        } else {
          alert('Something went wrong submitting an Assignment');
        }
      },
      error: function (response) {
        console.log('ERR_RRORRERIRIRIR');
        console.log(response);
      }

    });

  },




  create_collection: function (data, callback) {

    // {
    //   name: 'Assignment #'+response.assignment_id+' Collection',
    //   description: 'Collection for #'+response.assignment_id,
    //   tags: 'some, example, collection tags'
    // }

    $.ajax({
      url: yellr.URLS.create_collection,
      type: 'POST',
      dataType: 'json',
      data: data,
      success: function (response) {
        if (response.success) {
          if (callback) callback();
          // clear array
        } else console.log('something went wrong creating a collection for this assignment');
      }
    });

  },



  // get the latest Yellr posts
  // ----------------------------
  get_posts: function (callback) {

    var success = false,
        posts = [];

    $.getJSON(yellr.URLS.get_posts, function (response) {
      if (response.success) {
        success = true;
        posts = yellr.utils.convert_object_to_array(response.posts);
        // yellr.DATA.posts = posts.reverse();
        yellr.DATA.posts = posts;
        yellr.utils.save();
      } else {
        yellr.utils.notify('Something went wrong loading posts.');
      }

    }).done(function () {
      if (success) callback(posts);
    }).fail(function () {
      yellr.utils.redirect_to_login();
    });

  },



  // get the user's assignments
  // ----------------------------
  get_my_assignments: function (callback) {

    var success = false,
        assignments;

    $.getJSON(yellr.URLS.get_my_assignments, function (response) {
      if (response.success) {
        success = true;
        assignments = yellr.utils.convert_object_to_array(response.assignments);
        yellr.DATA.assignments = assignments;
        yellr.utils.save();
      } else {
        console.log('something went wrong loading get_my_assignments');
      }
    }).done(function () {
      if (success) callback(assignments);
    }).fail(function () {
      yellr.utils.redirect_to_login();
    });

  },



  get_responses_for: function (assignment_id, callback) {

    // get our assignment responses
    var success = false,
        posts;

    // get assignment responses
    $.ajax({
      url: yellr.URLS.get_assignment_responses+'&assignment_id='+assignment_id.toString(),
      type: 'POST',
      dataType: 'json',
      success: function (response) {
        if (response.success) {
          success = true;
          posts = response.posts;
        }
      }
    }).done(function () {
        if (success) callback(posts);
    }).fail(function () {
      yellr.utils.redirect_to_login();
    });

  },


  get_collection: function (collectionID, callback) {
  // get_collection: function (collectionID, render_settings) {

    /**
     * get_collection - for Assignments overview page
     * make API post to server, get a collection back (array of posts)
     * (for now) we always render
     */

    var collection_name = '',
        collection = [],
        result = false;

    $.getJSON(yellr.URLS.get_collection_posts, {
      collection_id: collectionID
    }, function (response) {

      // set return values
      if (response.success) {
        result = true;
        collection = yellr.utils.convert_object_to_array(response.posts);
        collection_name = response.collection_name;
      }

    }).done(function () {

      if (result) {
        // execute callback
        if (callback) callback({
          collection: collection,
          collection_name: collection_name
        });
      } else {
        console.log('something went wrong loading collection posts');
      }

    }).fail(function () {
      yellr.utils.redirect_to_login();
    });
  },



  get_my_collections: function (callback) {

    $.getJSON(yellr.URLS.get_my_collections, function (response) {
      if (response.success) {
        // save our collections
        yellr.DATA.collections = response.collections;
        yellr.utils.save();
      } else {
        console.log('something went wrong getting your collections');
      }
    }).done(function () {
      if (callback) callback();
    }).fail(function () {
      yellr.utils.redirect_to_login();
    });

  },


  add_post_to_collection: function (post_id, collection_id, callback) {

    // post_id = int
    // collection_id = int
    // callback = function (boolean)
    // ----------------------------
    var result = false;

    // post to server
    $.post(yellr.URLS.add_post_to_collection,
    {
      post_id: post_id,
      collection_id: collection_id
    },
    function (response) {
      if (response.success) result = true;
    }).done(function () {
      // provide feedback
      if (result) console.log('added post to collection');
      else console.log('something went wrong adding the post to the collection');

      // execute callback
      if (callback) callback(result);

    }).fail(function () {
      console.log('something went wrong adding the post to the collection');
      return result;
    });

  },



  get_messages: function (callback) {

    /**
     * by default this function will make an API call,
     * and save messages to localStorage
     *
     * options: {
     *   callback: function() {console.log('will be called in .done()')},
     *   feedback: boolean [2do]
     *   feedbackText: 'optional string to send to yellr.utils.notify()' [2do]
     * }
     */

    $.getJSON(yellr.URLS.get_my_messages, function (response) {

      // save messages to localStorage
      if (response.success) yellr.DATA.messages = response.messages;
      else yellr.utils.notify('Could not load new messages.');

    }).done(function () {
      // do the callbacks
      if (callback) callback();
    }).fail(function () {
      yellr.utils.redirect_to_login();
    });

  },



  send_message: function (subject, text, to, callback, parent_message_id) {

    var data = {
      subject: subject,
      text: text,
      to_client_id: to,
    }
    if (parent_message_id) data.parent_message_id = parent_message_id;

    $.ajax({
      type: 'POST',
      url: yellr.URLS.create_message,
      dataType: 'json',
      data: data,
      success: function (response) {
        if (response.success) {
          yellr.utils.notify('Message sent!');
        } else {
          yellr.utils.notify('Error sending message. Check the user ID.');
        }
      }
    }).done(function () {
      if (callback) callback();
    });


  },


  publish_story: function (data, callback) {

    $.post(yellr.URLS.publish_story, data,
    function (response) {
      if (response.success) {
        if (callback) callback(response);
      } else {
        yellr.utils.notify('something went wrong');
      }
    });

  }

}

'use strict';
var yellr = yellr || {};

yellr.utils = {

  convert_object_to_array: function (object) {
    var array = [];
    for (var key in object) {
      array.push(object[key]);
    }
    return array;
  },


  notify: function (text) {
    // TODO
    console.log(text);
  },



  redirect_to: function (page) {
    var url_base = '/moderator/';
    window.location.replace(url_base+page);
  },



  redirect_to_login: function () {
    if (document.querySelector('body').getAttribute('data-page') !== 'login') {
      yellr.utils.redirect_to('login.html');
    }

  },



  logout: function () {
    localStorage.removeItem('yellr-mod');
    yellr.utils.redirect_to_login('You have been logged out');
  },


  load_localStorage: function () {

    // get auth token
    var local = JSON.parse(localStorage.getItem('yellr-mod'));
    yellr.DATA        = local.DATA;
    yellr.SETTINGS    = local.SETTINGS;
    yellr.TOKEN       = local.TOKEN;
    yellr.URLS        = local.URLS;

  },


  load: function (settings) {

    /**
     * settings = {
     *   data - is the object name of the data we want
     *   saveAs - save the reponse the the DATA object as this parameter
     *     * only works if saveAs is the same as the response, else use callback to handle it
     *   callback - do things with the server response
     * }
     */

    // setup our data object
    if (yellr.DATA === undefined) yellr.DATA = {};

    // do te things
    $.getJSON(yellr.URLS[settings.data], function(response) {

      if (response.success) {

        // save the JSON data directly
        if (settings.saveAs) {

          // sometimes what we get back is an object
          // we iterate through the objects keys to generate an array we can use
          if (Array.isArray(response[settings.saveAs]) === false) {

            var array = [];
            for (var key in response.posts) {
              array.push(response.posts[key]);
            }
            yellr.DATA[settings.saveAs] = array;

          } else {
            // if it's already an array, just set it
            yellr.DATA[settings.saveAs] = response[settings.saveAs];
          }

          if (settings.saveAs === 'posts') {

            yellr.DATA.posts.reverse();
          }

          // save the data
          yellr.utils.save();
        }
        // or do stuff with it
        if (settings.callback) settings.callback(response);
      } else {

        console.log(response);
        console.log(yellr.URLS[settings.data]);
        console.log(''+
          'Something went wrong loading: '+ settings.data+'\n'+
          'This could be because your previous session has expired. Please log back in');
        // yellr.utils.redirect_to_login(''+
        //   'Something went wrong loading: '+ settings.data+'\n'+
        //   'This could be because your previous session has expired. Please log back in');


      }
    });
    // /end getJSON

  },


  save: function() {

    localStorage.setItem('yellr-mod', JSON.stringify({
      DATA      : yellr.DATA,
      SETTINGS  : yellr.SETTINGS,
      TOKEN     : yellr.TOKEN,
      URLS      : yellr.URLS
    }));

  },


  set_urls: function () {

    var base_url = yellr.BASE_URL+'admin/';

    yellr.URLS = {
      // get latest user posts
      get_posts:                    base_url+'get_posts.json?token='+yellr.TOKEN,
      // messaging
      get_my_messages:              base_url+'get_my_messages.json?token='+yellr.TOKEN,
      create_message:               base_url+'create_message.json?token='+yellr.TOKEN,
      // questions/assignments
      create_question:              base_url+'create_question.json?token='+yellr.TOKEN,
      get_my_assignments:           base_url+'get_my_assignments.json?token='+yellr.TOKEN,
      publish_assignment:           base_url+'publish_assignment.json?token='+yellr.TOKEN,
      update_assignment:            base_url+'update_assignment.json?token='+yellr.TOKEN,
      get_assignment_responses:     base_url+'get_assignment_responses.json?token='+yellr.TOKEN,
      // collections
      create_collection:            base_url+'create_collection.json?token='+yellr.TOKEN,
      get_my_collections:           base_url+'get_my_collections.json?token='+yellr.TOKEN,
      disable_collection:           base_url+'disable_collection.json?token='+yellr.TOKEN,
      add_post_to_collection:       base_url+'add_post_to_collection.json?token='+yellr.TOKEN,
      remove_post_from_collection:  base_url+'remove_post_from_collection.json?token='+yellr.TOKEN,
      get_collection_posts:         base_url+'get_collection_posts.json?token='+yellr.TOKEN,
      // meta
      get_languages:                base_url+'get_languages.json?token='+yellr.TOKEN,
      get_question_types:           base_url+'get_question_types.json?token='+yellr.TOKEN,
      create_user:                  base_url+'create_user.json?token='+yellr.TOKEN,
      // publish
      publish_story:                base_url+'publish_story.json?token='+yellr.TOKEN,
      upload:                       yellr.BASE_URL+'upload_media.json'
    }

    // save new urls
    yellr.utils.save();

  },



  show_overlay: function (args) {

    var overlay = document.querySelector('#overlay-div-container');
    overlay.className = 'active';

    // listen for a close event
    overlay.onclick = yellr.utils.clear_overlay;


    if (args) {
      this.render_template({
        template: args.template,
        context: args.context,
        target: overlay
      })
    }

  },



  clear_overlay: function (e) {
    if (e === undefined || e.target.id === 'overlay-div-container') {
      var overlay = document.querySelector('#overlay-div-container');
      overlay.className = '';
      overlay.removeEventListener('click', yellr.utils.clear_overlay,false);
      return;
    }
  },




  render_template: function(settings) {
    /**
     * Dependencies: Handlebar.js, zepto.js (or jQuery.js)
     *
     * settings = {
     *   template: '#script-id',
     *   target: '#query-string',
     *   context: {},
     *   events: func
     * }
     */


    // get Handlebar template
    if (!settings.template || settings.template ==='') {
      $(settings.target).html(''); // if template is empty, clear HTML of target
      return;
    };
    var template = Handlebars.compile($(settings.template).html());

    // render it (check it we have a context)
    var html = template( settings.context ? settings.context : {} );

    // replace html, or return HTML frag
    if (settings.append) $(settings.target).append(html);
    else if (settings.prepend) $(settings.target).prepend(html);
    else $(settings.target).html(html);

  }

};

'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.all_assignments = function () {

  yellr.server.get_my_assignments(function () {

    // prep our assignments context
    var assignments = yellr.DATA.assignments.filter(function (val, i, arr) {
      val.title = val.questions[0].question_text;
      val.expire_datetime = moment(val.expire_datetime).format('MMM Do YYYY');
      val.url = 'view-assignment.html#'+val.assignment_id;
      return true;
    })

    // render html
    yellr.utils.render_template({
      template: '#my-assignment-li',
      target: '.my-assignments-list',
      context: {assignments: assignments}
    });
  });

}

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

'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.inbox = function () {


    // load messages json
    $.getJSON(args.data_url, function (data) {
      raw_data = data.messages;
      self.render();
    });


    var html = template({messages: raw_data});

    $(unread_target).html(html);
    $(read_target).html(html);

    // check for new messages
    // (alert user of this action)
   yellr.server.get_messages(function () {

      // var filtered_messages = yellr.messages.filter_messages();

      // // render messages
      // yellr.utils.render_template({
      //   template: '#inbox-li',
      //   target: '#unread-mail-list',
      //   context: {messages: filtered_messages.unread}
      // });

      // yellr.utils.render_template({
      //   template: '#inbox-li',
      //   target: '#read-mail-list',
      //   context: {messages: filtered_messages.read}
      // });
    });





    // view a message
    document.querySelector('#inbox').onclick = function view_message(e) {

      // read the data-id attribute of the right node
      var message_id = (e.target.nodeName === 'LI') ? e.target.getAttribute('data-id') : e.target.parentNode.getAttribute('data-id'),
          message = yellr.DATA.messages.filter(function (val, i, arr) {
            if (val.message_id === parseInt(message_id)) return true;
          })[0];

      yellr.utils.show_overlay({
        template: '#view-message-template',
        context: message
      });

    };


    // // create a new message
    // document.querySelector('#new-message-btn').onclick = function() {
    //   yellr.messages.create_new_message();
    // }



  // filter_messages: function () {

  //   /**
  //    * filter yellr.DATA.messages, returns an object
  //    *
  //    * reseults: {
  //    *   read: [array],
  //    *   unread: [array]
  //    * }
  //    */

  //   var read = [];
  //   var unread = yellr.DATA.messages.filter(function (val, i, arr) {

  //     // convert message_datetime to readable format here
  //     val.message_datetime = moment(val.message_datetime).format('MMM Do, h:mm a');

  //     if (parseInt(val.was_read) === 0) return true;
  //     else read.push(arr[i]);
  //   });

  //   return {
  //     read: read,
  //     unread: unread
  //   };

  // }

}

'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

// index.html

yellr.view.index = {

  /**
   * setup the Yellr Admin dashboard
   * index.html
   *
   * - get user assignments
   * - get latest Yellr posts
   * - toggle grid/list view
   * - toggle auto-update
   * - setup feed filter
   *
   */

  timeout: undefined,
  pckry: undefined,

  init: function () {
    var grid = document.querySelector('#raw-feed'),
        latest_4_assignments = [];


    // get my assignments
    // ----------------------------
    // ----------------------------
    yellr.server.get_my_assignments(function (assignments) {
      // get 4 latest
      for (var i = 0; i < assignments.length; i++) {
        latest_4_assignments.push(assignments[i]);
        if (latest_4_assignments.length >= 4) break;
      };

      // use moment.js
      latest_4_assignments.filter(function (val) {
        val.expire_datetime = moment(val.expire_datetime).fromNow(true);
      });

      // render html
      yellr.utils.render_template({
        template: '#active-assignment-template',
        target: '#active-assignments-list',
        context: {assignments: latest_4_assignments }
      });

    });


    // get latest posts
    // setup the grid
    // ----------------------------
    yellr.server.get_posts(function () {
      yellr.utils.render_template({
        template: '#raw-feed-item',
        target: '#raw-feed',
        context: {posts: yellr.DATA.posts.reverse()},
        // context: {posts: yellr.DATA.posts},
        prepend: true
      });

      setTimeout(function () {
        // setup packery
        yellr.view.index.pckry = new Packery(grid, {
          itemSelector: '.feed-gi',
          columnWidth: '.feed-sizer',
          gutter: '.feed-gutter'
        });
      }, 1000);
    });



    // view, and filter things
    // ----------------------------
    // ----------------------------




    // toggle grid/list view
    // ----------------------------
    document.querySelector('#feed-view').onclick = function (event) {

      var view, grid_items;

      if (event.target.checked) {

        view = event.target.value;

        // what are we doing?
        if (view === 'list') {

          // change li class
          grid_items = grid.querySelectorAll('.feed-gi');
          for (var i = 0; i < grid_items.length; i++) {
            grid_items[i].className = 'gi';
          };

          // destroy pakcry
          yellr.view.index.pckry.destroy();
        } else {
          grid_items = grid.querySelectorAll('.gi');
          for (var i = 0; i < grid_items.length; i++) {
            grid_items[i].className = 'feed-gi';
          };

          // redo packry
          yellr.view.index.pckry = new Packery(grid, {
            itemSelector: '.feed-gi',
            columnWidth: '.feed-sizer',
            gutter: '.feed-gutter'
          });
        }
      } // /if input.checked
    }
    // ----------------------------



    // auto-update
    // ----------------------------
    document.querySelector('#auto-update').onclick = function (event) {
      if (event.target.checked === true) yellr.AUTO_REFRESH = true;
      else yellr.AUTO_REFRESH = false;
      // do the
      yellr.view.index.refresh();
    }

    // setup the filter
    // ----------------------------
    document.querySelector('.feed-filter-div').onclick = function (event) {
      console.log('hello from: ');
    }


    // event listeners:
    // - send a message to a user who submitted content
    // - add post to a collection
    // - flag inappropriate content
    grid.onclick = function(e) {
      switch (e.target.className) {

        // add post to a collection
        case 'fa fa-folder':
          // show a list of collections via a dropdown
          // pass in the DOM element
          yellr.feed.toggle_collections_dropdown(e.target);
          break;

        // send user a message
        case 'fa fa-comment':

          var domNode = e.target.offsetParent.querySelector('.meta-div'),
              postID = parseInt(domNode.getAttribute('data-post-id')),
              data = yellr.DATA.posts.filter(function (val, i, arr) {
                if (val.post_id === postID) return true;
              })[0];

          yellr.utils.show_overlay({
            template: '#send-message-template',
            context: {
              uid: data.client_id,
              subject: 'RE: '+data.title
            }
          });

          var $form = $('#send-message-form');
          $form.submit(function (e) {
            e.preventDefault();
            var array = $form.serializeArray();

            yellr.messages.send_message({
              to: array[0],
              subject: array[1],
              text: array[2],
              callback: function () {
                yellr.utils.clear_overlay();
              }
            });
          });

          break;
        // flag as inappropriate
        case 'fa fa-flag':
          console.log('report the motherfucker');
          break;
        default:
          break;
      }
    };

    // refresh posts every 10 seconds
    if (yellr.AUTO_REFRESH) this.refresh();
  },

  refresh: function (timeout) {
    if (yellr.AUTO_REFRESH) {

      yellr.view.index.timeout = setTimeout(function () {
        // TODO
        // update the "Last updated thing"
        yellr.server.get_posts(function () {

          var current_posts = document.querySelectorAll('.feed-gi').length,
              new_posts = [],
              new_items = [];

          if (yellr.DATA.posts.length > current_posts) {
            for (var i = current_posts; i < yellr.DATA.posts.length; i++) {
              new_posts.push(yellr.DATA.posts[i]);
            };

            // render the latest ones
            yellr.utils.render_template({
              template: '#raw-feed-item',
              target: '#raw-feed',
              context: {posts: new_posts},
              prepend: true
            });

            // redo packery
            setTimeout(function () {
              yellr.view.index.pckry.reloadItems();
              yellr.view.index.pckry.layout();
            }, 1000);
          }

        });

        // loop
        yellr.view.index.refresh(timeout);
      }, 3000);
      // }, 10000);
    } else {
      window.clearTimeout(yellr.view.index.timeout);
      return;
    }
  }

};

'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

// index.html

yellr.view.login = function () {

  document.querySelector('#mod-login').onsubmit = function (event) {

    event.preventDefault();

    // login (username, passwod, error feedback)
    // login automatically goes to index.html
    yellr.server.login(this.elements['user_name'].value, this.elements['password'].value, function (response) {
      // handle login errors
      if (!response.success) document.querySelector('#login-feedback').innerHTML = response.error_text;
    });
  }
}

'use strict';
var yellr =  yellr || {};
    yellr.view = yellr.view || {};

yellr.view.view_assignment = function () {

  // 1.   render text
  // 2.   get assignment-responses
  // 3.   show current collection

  // get the URL hash
  // --> that is our assignment_id
  var assignment_id = parseInt(window.location.hash.split('#')[1]);

  // make sure it's a valid number
  if (assignment_id !== NaN) {

    // 1.
    // render the question text and things
    // ===================================
    var assignment = yellr.DATA.assignments.filter(function (val, i, arr) {
      if (val.assignment_id === assignment_id) return true;
    })[0];

    // render the Handlebars template
    yellr.utils.render_template({
      template: '#assignment-overview-template',
      target: '#view-assignment-section',
      context: {assignment: assignment}
    });

    // parse UTC dates with moment.js
    var deadline = document.querySelector('.assignment-deadline');
        deadline.innerHTML = moment(deadline.innerHTML).format('MMMM Do YYYY');
    var published = document.querySelector('.assignment-published');
        published.innerHTML = moment(published.innerHTML).format('MMMM Do YYYY');




    // 2.
    // get assignent-responses
    // ===================================
    yellr.server.get_responses_for(assignment_id, function (posts) {
      var replies = yellr.utils.convert_object_to_array(posts);
      console.log(replies);
      // yellr.utils.render_template({
      //   template: '#assignment-response-li-template',
      //   target: '#assignment-replies-list',
      //   context: {replies: replies}
      // });

    });



    // 2.
    // get assignment collection
    // ===================================
    yellr.server.get_collection(assignment_id, function (response) {
      yellr.utils.render_template({
        template: '#collections-li-template',
        target: '#assignment-collection-list',
        context: {
          collection: response.collection
        }
      })
    });


    // set the collection_id attribute to the #assignment-collections-list
    document.querySelector('#assignment-collection-list').setAttribute('data-collection-id', assignment_id);

  }

}

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

'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};

yellr.view.write_article = function () {

  document.querySelector('#post-btn').onclick = function (event) {
    // post the article
    // ===================================
    var article_data = {},
        title = document.querySelector('#article-title'),
        tags = document.querySelector('#article-tags'),
        body = document.querySelector('#article-body'),
        leadin = document.querySelector('#article-leadin');

    article_data.title = title.value;
    article_data.banner_media_id = '';
    article_data.tags = tags.value;
    article_data.contents = body.value;
    article_data.top_text = leadin.value;
    article_data.language_code = 'en';
    article_data.top_left_lat = 43.4;
    article_data.top_left_lng = -77.9;
    article_data.bottom_right_lat = 43.0;
    article_data.bottom_right_lng = -77.3;

    yellr.server.publish_story(article_data, function (response) {
      // clear old values
      title.value = '';
      tags.value = '';
      tags.value = '';
      body.value = '';
      leadin.value = '';

      // open the article in the new page
      var url = '/story?id='+response.story_unique_id;
      window.open(url, '_blank');
      alert('Article has been posted! \n'+url);
      yellr.utils.notify('Article has been posted! \n'+url);
    });
  }


  // // get the collection for the assignment
  // mod.collections.get_collection(parseInt(window.location.hash.split('#')[1]), function (response) {

  //   // render the assignment's collection for the editor
  //   mod.utils.render_template({
  //     template: '#collections-li-template',
  //     target: '#write-article-collection-list',
  //     context: {
  //       collection: response.collection
  //     }
  //   });

  // });


  // function Editor(input, preview) {
  //   this.update = function () {
  //     var title = '# ' + $('#article-title').val() + '\n';
  //     preview.innerHTML = markdown.toHTML(title + input.value);
  //   };
  //   input.editor = this;
  //   this.update();
  // }

  // var editor = new Editor(document.getElementById("markdown-editor"), document.getElementById("editor-preview"));


  // // setup event listeners
  // $('#preview-btn').on('click', function (e) {

  //   var $editor = $('#editor-workspace .editor-container');
  //   var new_inactive = $editor.find('.active');
  //   var new_active = $editor.find('.inactive');
  //   new_inactive.removeClass('active').addClass('inactive');
  //   new_active.removeClass('inactive').addClass('active');
  //   editor.update();
  // });


  document.querySelector('#article-body').ondrop = function (event) {
    console.log(event);
    // console.log('hello from: ');
    var data = event.dataTransfer.getData('text/x-media');
    // var data = event.dataTransfer.getData('media');
    console.log(data);
    // var data = event.dataTransfer.getData(internalDNDType);
  }
  // document.querySelector('#article-body').setAttribute('dropzone', 'move string:media');
// dropzone="move string:text/x-example"


  // var collection_li = document.querySelectorAll('#write-article-collection-list li');
  document.querySelector('#write-article-collection-list').ondragstart = function (event) {
    console.log('dragstart');
    // console.log(event.target);
    console.log(event.target.dataset.media);
    // event.dataTransfer.setData('media', event.target.dataset.media);
    // event.dataTransfer.setData('text/x-media', event.target.dataset.value);
    // event.dataTransfer.setData(internalDNDType, event.target.dataset.value);
    // event.dataTransfer.effectAllowed = 'move';
    // event.dataTransfer.effectAllowed = 'move';
  };
  // for (var i = 0; i < collection_li.length; i++) {
  //   collection_li[i].ondragstart = function (event) {
  //     // console.log(event);
  //     // console.log(event.target);
  //     console.log(event.target.dataset.media);
  //     event.dataTransfer.setData('media', event.target.dataset.media);
  //     event.dataTransfer.setData('text/x-media', event.target.dataset.value);
  //     // event.dataTransfer.setData(internalDNDType, event.target.dataset.value);
  //     // event.dataTransfer.effectAllowed = 'move';
  //     // event.dataTransfer.effectAllowed = 'move';
  //   }
  // };



  // // drag and drop an item onto the collections nav link
  // var drop_target = document.querySelector('#article-body');
  // drop_target.ondragover = function(e) {
  //   // moderator.allowDrop(e);
  //   e.preventDefault();
  //   // console.log(e);
  //   // console.log(this);
  //   this.style.background = 'tomato';
  // }
  // drop_target.ondragleave = function(e) {
  //   e.preventDefault();
  //   this.style.background = 'transparent';
  // }
  // drop_target.ondrop = function(e) {
  //   e.preventDefault();
  //   this.style.background = 'blue';
  //   console.log(e.dataTransfer);
  //   // console.log('story id: ', e.dataTransfer.getData('story_id'));
  // }




};
