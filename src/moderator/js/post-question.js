'use strict';

document.querySelector('#post-question-btn').onclick = function() {
  // alert('show form to post a new question');

  // add an overlay over everything
  // document.querySelector('#moderator').className = 'overlay';

  // activate the overlay layer
  var overlay = document.querySelector('#overlay-div-container');
  overlay.className = 'active';

  // listen for a close event
  overlay.onclick = clear_overlay;
}


var clear_overlay = function clear_overlay(e) {
  console.log(e);
  if (e.target.id === 'overlay-div-container') {
    console.log('clicked on overlay. close');
    var overlay = document.querySelector('#overlay-div-container');
    overlay.className = '';
    overlay.removeEventListener('click', clear_overlay,false);
    return;
  }

}

// console.log(clear_overlay);
