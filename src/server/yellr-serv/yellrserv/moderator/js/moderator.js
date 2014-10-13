/*!
 * yellr v0.0.1 (http://hhroc.github.io/)
 * Copyright 2014 hhroc - Hacks and Hackers Rochester
 * Licensed under AGPLv3 (https://github.com/hhroc/yellr/blob/master/LICENSE)
 */


'use strict';
var mod = mod || {};

var DEBUG = true;
// var BASE_URL = 'http://127.0.0.1:8080/';
var BASE_URL = '/';

window.onload = function () {

    // Handlebars check
    // -----------------------------
    if (!Handlebars || !$) {
      console.log('missing dependencies for mod.utils.render_template');
      return;
    }
    // ----------------------------



    // check for pre-existing data, if none, create it
    if (localStorage.getItem('yellr-mod') === null) mod.utils.redirect_to_login('Missing authentication token. Please login to continue');
    else mod.utils.load_localStorage();

    // make sure we have our DATA object setup
    if (mod.DATA === undefined) mod.DATA = {};

    // get our current page
    mod.PAGE = document.querySelector('body').getAttribute('data-page');

    // do specfic things for each page
    switch (mod.PAGE) {
      case 'index':
        mod.setup.dashboard();
        break;
      case 'login':
        mod.setup.login();
        break;
      case 'assignments':
        mod.setup.assignments_page();
        break;
      case 'single-assignment':
        mod.setup.single_assignment_view();
        break;
      case 'editor':
        mod.editor.init();
        break;
      case 'collections':
        mod.setup.collections_page();
        break;
      case 'single-collection':
        mod.setup.single_collection_view();
        break;
      case 'messages':
        mod.setup.inbox();
        break;
      default:
        console.log('lol ok');
        break;
    }

    if (document.querySelector('#sidebar')) mod.utils.setup_sidebar();

}

'use strict';
var mod = mod || {};

// this contains very specific DOM refernces based on each page
// the rest of the JS files try to remain as agnostic as possible

mod.setup = {


  single_collection_view: function () {

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
    mod.collections.get_collection(collection_id, function (response) {

      // show collection name
      document.querySelector('.t1').innerHTML = response.collection_name;

      // render the collection items
      mod.utils.render_template({
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

  },


  login: function () {

    var $form = $('#mod-login');

    $form.submit(function (e) {
      e.preventDefault();
      var fields = $form.serializeArray();

      mod.utils.login(fields[0].value, fields[1].value);
    });
  },



  assignments_page: function () {
    mod.assignments.get_my_assignments({
      callback: function () {
        console.log(mod.DATA.assignments);

        // prep our assignments context
        var assignments = mod.DATA.assignments.filter(function (val, i, arr) {
          val.title = val.questions[0].question_text;
          val.expire_datetime = moment(val.expire_datetime).format('MMM Do YYYY');
          val.url = 'view-assignment.html#'+val.assignment_id;
          return true;
        })

        // render html
        mod.utils.render_template({
          template: '#my-assignment-li',
          target: '.my-assignments-list',
          context: {assignments: assignments}
        });
      }
    });

  },



  single_assignment_view: function () {

    var assignment_id = parseInt(window.location.hash.split('#')[1]);

    if (assignment_id !== NaN) {
      // render the question text and things
      mod.assignments.view(assignment_id);

      // get replies to question
      mod.assignments.get_responses_for({
        assignment_id: assignment_id,
        callback: function (posts) {
          var replies = mod.utils.convert_object_to_array(posts);

          mod.utils.render_template({
            template: '#assignment-response-li-template',
            target: '#assignment-replies-list',
            context: {replies: replies}
          });

          // parse UTC dates with moment.js
          var deadline = document.querySelector('.assignment-deadline');
              deadline.innerHTML = moment(deadline.innerHTML).format('MMMM Do YYYY');
          var published = document.querySelector('.assignment-published');
              published.innerHTML = moment(published.innerHTML).format('MMMM Do YYYY');

        }
      });

      // get assignment collection
      mod.collections.get_collection(assignment_id, function (response) {
        mod.utils.render_template({
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


  },


  collections_page: function () {

    // get my collections
    mod.collections.get_my_collections({
      callback: function () {

        // parse datetime with moment.js
        // add url attribute for Handlebar template peace of mind
        var collections = mod.DATA.collections.filter(function (val, i ,arr) {
          val.collection_datetime = moment(val.collection_datetime).format('MMM Do YYYY');
          val.url = 'view-collection.html#'+val.collection_id;
          return true;
        });

        // render html
        mod.utils.render_template({
          template: '#collections-gi-template',
          target: '.collections-grid',
          context: {collections: collections}
        });
      }
    });


    // hook up the buttons
    document.querySelector('#new-collection-btn').onclick = function (e) {

      mod.utils.show_overlay({template: '#collections-form-template'});
      mod.collections.setup_form();

    }
    document.querySelector('#delete-collection-btn').onclick = function (e) {
      console.log('delete collection');
    }



  },


  inbox: function () {

    // check for new messages
    // (alert user of this action)
    mod.messages.get_messages({
      feedback: true,
      callback: function () {

        var filtered_messages = mod.messages.filter_messages();

        // render messages
        mod.utils.render_template({
          template: '#inbox-li',
          target: '#unread-mail-list',
          context: {messages: filtered_messages.unread}
        });

        mod.utils.render_template({
          template: '#inbox-li',
          target: '#read-mail-list',
          context: {messages: filtered_messages.read}
        });
      }
    });



    // view a message
    document.querySelector('#inbox').onclick = function view_message(e) {

      // read the data-id attribute of the right node
      var message_id = (e.target.nodeName === 'LI') ? e.target.getAttribute('data-id') : e.target.parentNode.getAttribute('data-id'),
          message = mod.DATA.messages.filter(function (val, i, arr) {
            if (val.message_id === parseInt(message_id)) return true;
          })[0];

      mod.utils.show_overlay({
        template: '#view-message-template',
        context: message
      });

    };


    // create a new message
    document.querySelector('#new-message-btn').onclick = function() {
      mod.messages.create_new_message();
    }
  },


  dashboard: function () {

    /**
     * setup the Yellr Admin dashboard
     * index.html
     */

    // get my assignments
    mod.assignments.get_my_assignments({
      callback: function () {
        // get 4 latest
        var latest_4_assignments = [];
        for (var i = 0; i < mod.DATA.assignments.length; i++) {
          latest_4_assignments.push(mod.DATA.assignments[i]);
          if (latest_4_assignments.length >= 4) break;
        };

        // use moment.js
        latest_4_assignments.filter(function (val) {
          val.expire_datetime = moment(val.expire_datetime).fromNow(true);
        });

        // render html
        mod.utils.render_template({
          template: '#active-assignment-template',
          target: '#active-assignments-list',
          context: {assignments: latest_4_assignments }
        });

      }
    });


    // get latest posts
    mod.posts.get_posts({
      callback: function () {
        mod.utils.render_template({
          template: '#latest-posts-template',
          target: '#latest-posts',
          context: {posts: mod.DATA.posts}
        });
      }
    });

    // event listeners:
    // - send a message to a user who submitted content
    // - add post to a collection
    // - flag inappropriate content
    document.querySelector('.submissions-grid').onclick = function(e) {
      switch (e.target.className) {

        // add post to a collection
        case 'fa fa-folder':
          // show a list of collections via a dropdown
          // pass in the DOM element
          mod.feed.toggle_collections_dropdown(e.target);
          break;

        // send user a message
        case 'fa fa-comment':

          var domNode = e.target.offsetParent.querySelector('.meta-div'),
              postID = parseInt(domNode.getAttribute('data-post-id')),
              data = mod.DATA.posts.filter(function (val, i, arr) {
                if (val.post_id === postID) return true;
              })[0];

          mod.utils.show_overlay({
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

            mod.messages.send_message({
              to: array[0],
              subject: array[1],
              text: array[2],
              callback: function () {
                mod.utils.clear_overlay();
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


    // refresh the feed
    $('#refresh-posts').on('click', function (e) {

      // get latest posts
      mod.posts.get_posts({
        callback: function () {
          mod.utils.render_template({
            template: '#latest-posts-template',
            target: '#latest-posts',
            context: {posts: mod.DATA.posts}
          });
        }
      });

    });

    // refresh posts every 10 seconds
    mod.utils.load_latest_posts();
  }
}

'use strict';
var mod = mod || {};

mod.utils = {

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


  load_latest_posts: function () {
    setTimeout(function () {
      console.log('loading latest posts...');
      mod.posts.get_posts({
        callback: function () {
          mod.utils.render_template({
            template: '#latest-posts-template',
            target: '#latest-posts',
            context: {posts: mod.DATA.posts}
          });
        }
      });

      // loop
      mod.utils.load_latest_posts();
    }, 10000);
  },



  redirect_to: function (page) {
    var url_base = '/moderator/';
    window.location.replace(url_base+page);
  },



  redirect_to_login: function (message) {

    if (document.querySelector('body').getAttribute('data-page') !== 'login') {
      if (message) alert(message);
      mod.utils.redirect_to('login.html');
    }

  },


  login: function (username, password) {

    // SET THE URLS HERE NOW THAT WE HAVE A USERNAME AND PASSWORD
    var url = BASE_URL+'admin/get_access_token.json?user_name='+username+'&password='+password;

    // $form
    $.ajax({
      type: 'POST',
      url: url,
      dataType: 'json',
      success: function (data) {
        if (data.success) {
          mod.TOKEN = data.token;
          mod.utils.save();
          mod.utils.set_urls();

          // load languages
          $.ajax({
            url: mod.URLS.get_languages,
            type: 'POST',
            dataType: 'json',
            success: function (response) {
              if (response.success) {
                mod.DATA.languages = response.languages;
                mod.utils.save();
              } else {
                alert('Something went wrong loading Languages. Things might get weird from here...');
              }
            }
          }).done(function () {
            console.log('done loading languages');
            mod.utils.redirect_to('index.html');
          });

        } else {
          document.querySelector('#login-feedback').innerHTML = data.error_text;
        }
      }
    });

  },


  logout: function () {
    localStorage.removeItem('yellr-mod');
    mod.utils.redirect_to_login('You have been logged out');
  },


  load_localStorage: function () {

    // get auth token
    var local = JSON.parse(localStorage.getItem('yellr-mod'));
    mod.DATA        = local.DATA;
    mod.SETTINGS    = local.SETTINGS;
    mod.TOKEN       = local.TOKEN;
    mod.URLS        = local.URLS;

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
    if (mod.DATA === undefined) mod.DATA = {};

    // do te things
    $.getJSON(mod.URLS[settings.data], function(response) {

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
            mod.DATA[settings.saveAs] = array;

          } else {
            // if it's already an array, just set it
            mod.DATA[settings.saveAs] = response[settings.saveAs];
          }

          if (settings.saveAs === 'posts') {

            mod.DATA.posts.reverse();
          }

          // save the data
          mod.utils.save();
        }
        // or do stuff with it
        if (settings.callback) settings.callback(response);
      } else {

        console.log(response);
        console.log(mod.URLS[settings.data]);
        console.log(''+
          'Something went wrong loading: '+ settings.data+'\n'+
          'This could be because your previous session has expired. Please log back in');
        // mod.utils.redirect_to_login(''+
        //   'Something went wrong loading: '+ settings.data+'\n'+
        //   'This could be because your previous session has expired. Please log back in');


      }
    });
    // /end getJSON

  },


  save: function() {

    localStorage.setItem('yellr-mod', JSON.stringify({
      DATA      : mod.DATA,
      SETTINGS  : mod.SETTINGS,
      TOKEN     : mod.TOKEN,
      URLS      : mod.URLS
    }));

  },


  set_urls: function () {

    var base_url = BASE_URL+'admin/';

    mod.URLS = {
      // get latest user posts
      get_posts:                    base_url+'get_posts.json?token='+mod.TOKEN,
      // messaging
      get_my_messages:              base_url+'get_my_messages.json?token='+mod.TOKEN,
      create_message:               base_url+'create_message.json?token='+mod.TOKEN,
      // questions/assignments
      create_question:              base_url+'create_question.json?token='+mod.TOKEN,
      get_my_assignments:           base_url+'get_my_assignments.json?token='+mod.TOKEN,
      publish_assignment:           base_url+'publish_assignment.json?token='+mod.TOKEN,
      update_assignment:            base_url+'update_assignment.json?token='+mod.TOKEN,
      get_assignment_responses:     base_url+'get_assignment_responses.json?token='+mod.TOKEN,
      // collections
      create_collection:            base_url+'create_collection.json?token='+mod.TOKEN,
      get_my_collections:           base_url+'get_my_collections.json?token='+mod.TOKEN,
      disable_collection:           base_url+'disable_collection.json?token='+mod.TOKEN,
      add_post_to_collection:       base_url+'add_post_to_collection.json?token='+mod.TOKEN,
      remove_post_from_collection:  base_url+'remove_post_from_collection.json?token='+mod.TOKEN,
      get_collection_posts:         base_url+'get_collection_posts.json?token='+mod.TOKEN,
      // meta
      get_languages:                base_url+'get_languages.json?token='+mod.TOKEN,
      get_question_types:           base_url+'get_question_types.json?token='+mod.TOKEN,
      create_user:                  base_url+'create_user.json?token='+mod.TOKEN,
      // publish
      publish_story:                base_url+'publish_story.json?token='+mod.TOKEN,
      upload:                       BASE_URL+'upload_media.json'
    }

    // save new urls
    mod.utils.save();

  },



  show_overlay: function (args) {

    var overlay = document.querySelector('#overlay-div-container');
    overlay.className = 'active';

    // listen for a close event
    overlay.onclick = mod.utils.clear_overlay;


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
      overlay.removeEventListener('click', mod.utils.clear_overlay,false);
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

  },




  setup_sidebar: function () {
    // set up the Post question form
    // it is ony evry page
    document.querySelector('#post-question-btn').onclick = mod.assignments.setup_form;
    document.querySelector('#logout-btn').onclick = mod.utils.logout;
  }


};

'use strict';
var mod = mod || {};

mod.assignments = (function() {

  var get_my_assignments = function (settings) {
    // make the API call to get the Admin's assignments
    $.getJSON(mod.URLS.get_my_assignments, function (response) {
      if (response.success) {

        mod.DATA.assignments = mod.utils.convert_object_to_array(response.assignments);
        mod.utils.save();

      } else {
        console.log('something went wrong loading get_my_assignments');
      }
    }).done(function () {
      if (settings.callback) settings.callback();
    }).fail(function () {
      mod.utils.redirect_to_login();
    });
  }




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



  var get_responses_for = function (settings) {

    // get our assignment respones
    // render them to HTML
    // this also sets up the event listeners

    // get assignment responses
    $.ajax({
      url: mod.URLS.get_assignment_responses+'&assignment_id='+settings.assignment_id,
      type: 'POST',
      dataType: 'json',
      success: function (response) {

        if (response.success) {
          if (settings.callback) settings.callback(response.posts);
        } else {
          console.log('lol Something went wrong loading assignment reponses');
        }
      }
    }).done(function () {

      // setup the action buttons for each resposne
      $('#assignment-replies-list').on('click', function (e) {
        switch (e.target.className) {
          case 'fa fa-plus':
            // get the DOM references
            var postNode = e.target.parentNode.parentNode.parentNode.querySelector('.meta-div'),
                collectionNode = document.querySelector('#assignment-collection-list');

            // add post to collection
            mod.collections.add_post_to_collection(postNode, collectionNode);
            break;

          case 'fa fa-comment':
            console.log('write a message');
            var uid = e.target.offsetParent.querySelector('.meta-div').getAttribute('data-uid')
            mod.messages.create_message(uid, 'RE: Recent post on Yellr');
            break;
          case 'fa fa-flag':
            console.log('mark as ain appropriate');
            break;
          case 'fa fa-trash':
            console.log('discard this reply');
            break;
          default:
            break;
        }
      });

    }).fail(function () {
      mod.utils.redirect_to_login();
    });


  }


  var view = function (assignment_id) {

    // load that assignment from localStorage
    var assignment = mod.DATA.assignments.filter(function (val, i, arr) {
      if (val.assignment_id === assignment_id) return true;
    })[0];

    // render the Handlebars template
    mod.utils.render_template({
      template: '#assignment-overview-template',
      target: '#view-assignment-section',
      context: {assignment: assignment}
    });

  }




  var setup_form = function () {

    // render the form
    mod.utils.show_overlay({
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
      mod.utils.clear_overlay();
    });


    // 2.
    $form.find('#language-select').on('change', function (e) {
      if (this.value !== '--') mod.assignments.create_question_form(this.value);
    });


    // 3.
    $save_btn.on('click', function (e) {
      mod.assignments.save_draft();
    });

    // 4.
    $preview_btn.on('click', function (event) {
      console.log('preview assignment');
      mod.assignments.preview_assignment();
    });


  }



  var create_question_form = function (language_code) {

    $extra_fields.hide();
    $preview_text.removeClass('active');

    // create a new question form based on the language selected
    mod.utils.render_template({
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
    //     url: mod.URLS.upload,
    //     data: {
    //       client_id: mod.TOKEN,
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
        mod.utils.render_template({
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
        url: mod.URLS.create_question,
        data: $question_form.serialize()+'&answers='+JSON.stringify(survey_answers),
        dataType: 'json',
        success: function (response) {
          if (response.success) {
            console.log('SUCCESS');
            // update our supported languages
            supported_languages.push(language_code)
            mod.assignments.successful_question_post(response);
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
      mod.assignments.post();
    });

    $extra_fields.show();


    this.language_feedback();

  }



  var language_feedback = function () {

    // give the user feedback on the languages the current assignment supports

    // get the languages the question supports compared to what yellr supports
    var languages = mod.DATA.languages.filter(function (val, i, array) {
      for (var j = 0; j < supported_languages.length; j++) {
        if (val.code === supported_languages[j]) {
          return true;
        }
      };
    });


    mod.utils.render_template({
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

          // create a collection for the assignment
          $.ajax({
            url: mod.URLS.create_collection,
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
                mod.utils.clear_overlay();
              } else console.log('something went wrong creating a collection for this assignment');
            }
          }).done(function () {

            // update our assignments
            mod.assignments.get_my_assignments({
              callback: function () {
                mod.utils.redirect_to('view-assignment.html#'+response.assignment_id);
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
    language_feedback: language_feedback,
    get_my_assignments: get_my_assignments,
    get_responses_for: get_responses_for
  }
})();

'use strict';
var mod = mod || {};

mod.collections = {


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

    $.getJSON(mod.URLS.get_collection_posts, {
      collection_id: collectionID
    }, function (response) {

      // set return values
      if (response.success) {
        result = true;
        collection = mod.utils.convert_object_to_array(response.posts);
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
      mod.utils.redirect_to_login();
    });
  },



  get_my_collections: function (options) {

    $.getJSON(mod.URLS.get_my_collections, function (response) {
      if (response.success) {
        // save our collections
        mod.DATA.collections = response.collections;
        mod.utils.save();
      } else {
        console.log('something went wrong getting your collections');
      }
    }).done(function () {
      if (options.callback) options.callback();
    }).fail(function () {
      mod.utils.redirect_to_login();
    });

  },


  add_post_to_collection: function (post_id, collection_id, callback) {

    // post_id = int
    // collection_id = int
    // callback = function (boolean)
    // ----------------------------
    var result = false;

    // post to server
    $.post(mod.URLS.add_post_to_collection,
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

'use strict';
var mod = mod || {};

mod.editor = (function() {

  var init = function () {
    // get the collection for the assignment
    mod.collections.get_collection(parseInt(window.location.hash.split('#')[1]), function (response) {

      // render the assignment's collection for the editor
      mod.utils.render_template({
        template: '#collections-li-template',
        target: '#editor-collections-list',
        context: {
          collection: response.collection
        }
      });

    });


    function Editor(input, preview) {
      this.update = function () {
        var title = '# ' + $('#article-title').val() + '\n';
        preview.innerHTML = markdown.toHTML(title + input.value);
      };
      input.editor = this;
      this.update();
    }

    var editor = new Editor(document.getElementById("markdown-editor"), document.getElementById("editor-preview"));


    // setup event listeners
    $('#preview-btn').on('click', function (e) {

      var $editor = $('#editor-workspace .editor-container');
      var new_inactive = $editor.find('.active');
      var new_active = $editor.find('.inactive');
      new_inactive.removeClass('active').addClass('inactive');
      new_active.removeClass('inactive').addClass('active');
      editor.update();
    });


    $('#editor-controls .submit-btn').on('click', function (e) {

      $.post(mod.URLS.publish_story, {
        title: $('#article-title').val(),
        tags: 'test, 1, 2, 3',
        top_text: $('#top-text').val(),
        banner_media_id: '',
        // banner_media_id: '329af2ee-6014-4a90-a7c3-05dba003c7ac',
        contents: $('#markdown-editor').val(),
        language_code: 'en',
        top_left_lat: 43.4,
        top_left_lng: -77.9,
        bottom_right_lat: 43.0,
        bottom_right_lng: -77.3
      },
      function (response) {
        if (response.success) {
          console.log('post successful!');
        } else {
          console.log('something went wrong');
        }
        console.log(response);
      });

    });


  }

  return {
    init: init
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
var mod = mod || {};

mod.messages = {

  get_messages: function (options) {

    /**
     * by default this function will make an API call,
     * and save messages to localStorage
     *
     * options: {
     *   callback: function() {console.log('will be called in .done()')},
     *   feedback: boolean [2do]
     *   feedbackText: 'optional string to send to mod.utils.notify()' [2do]
     * }
     */

    $.getJSON(mod.URLS.get_my_messages, function (response) {

      // save messages to localStorage
      if (response.success) mod.DATA.messages = response.messages;
      else mod.utils.notify('Could not load new messages.');

    }).done(function () {
      // do the callbacks
      if (options.callback) options.callback();
    }).fail(function () {
      mod.utils.redirect_to_login();
    });

  },


  filter_messages: function () {

    /**
     * filter mod.DATA.messages, returns an object
     *
     * reseults: {
     *   read: [array],
     *   unread: [array]
     * }
     */

    var read = [];
    var unread = mod.DATA.messages.filter(function (val, i, arr) {

      // convert message_datetime to readable format here
      val.message_datetime = moment(val.message_datetime).format('MMM Do, h:mm a');

      if (parseInt(val.was_read) === 0) return true;
      else read.push(arr[i]);
    });

    return {
      read: read,
      unread: unread
    };

  },






















  // ===================================
  // ===================================


  init: function (args) {
    self = this;
    template = Handlebars.compile($(args.template).html());
    container = args.container;
    read_target = args.read_target;
    unread_target = args.unread_target;


    // load messages json
    $.getJSON(args.data_url, function (data) {
      raw_data = data.messages;
      self.render();
    });

  },


  render: function () {

    // FIXME
    // the raw data should be parsed
    // there should be objects to hold data for:
    // READ and UNREAD data

    var html = template({messages: raw_data});

    $(unread_target).html(html);
    $(read_target).html(html);
  },


  send_message: function (options) {

    var data = {
      subject: options.subject.value,
      text: options.text.value,
      to_client_id: options.to.value,
    }
    if (options.parent_message_id) data.parent_message_id = options.parent_message_id;

    $.ajax({
      type: 'POST',
      url: mod.URLS.create_message,
      dataType: 'json',
      data: data,
      success: function (response) {
        if (response.success) {
          mod.utils.notify('Message sent!');
        } else {
          mod.utils.notify('Error sending message. Check the user ID.');
        }
      }
    }).done(function () {
      if (options.callback) options.callback();
    });


  }


};

'use strict';
var mod = mod || {};

mod.posts = {

  get_posts: function get_posts(options) {
    $.getJSON(mod.URLS.get_posts, function get_posts_callback(response) {
      if (response.success) {
        mod.DATA.posts = mod.utils.convert_object_to_array(response.posts).reverse();
        mod.utils.save();
      } else {
        mod.utils.notify('Something went wrong loading posts.');
      }

    }).done(function () {
      if (options.callback) options.callback();
    }).fail(function () {
      mod.utils.redirect_to_login();
    });
  }

};
