'use strict';
var yellr = yellr || {};
    yellr.view = yellr.view || {};


yellr.view.all_assignments = function () {

  yellr.server.get_my_assignments(function () {
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
  });

}
