"use strict";

var pop = document.getElementById("confirmPopup");

// Open confirm popup
$('.deleteBtn').click(function () {
    pop.style.display = "flex";
})

// Close confirm popup
$('.close').click(function () {
    pop.style.display = "none";
})
$('.confirm').click(function () {
    pop.style.display = "none";
})


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == pop) {
        pop.style.display = "none";
    }
  }