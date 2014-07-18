'use strict';
var yellr = yellr || {};

yellr.demo = {
  init: function() {
    console.log('load sample data');

    // targets
    var assignments = $('#latest-assignments'),
        newsfeed,
        notifications,
        messages,
        profile;



    // load sample assignments
    $.getJSON('data/assignments.json', function(data){
      // save it locally - use immediately
      localStorage.setItem('assignments', JSON.stringify(data));
      yellr.parse.assignments(JSON.parse(localStorage.getItem('assignments')));
    });



    // // load sample profile
    // $.getJSON('data/profile.json', function(data){
    //  localStorage.setItem('profile', JSON.stringify(data));
    //   yellr.parse.profile(JSON.parse(localStorage.getItem('profile')));
    // });


  }
}
