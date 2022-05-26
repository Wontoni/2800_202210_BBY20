"use strict";

var pop = document.getElementById("confirmPopup");

// Open confirm popup
$('.button').click(function (e) {
    pop.style.display = "flex";

    var dataNum = e.target.dataset.number;
    $('#confirmBtn').attr('data-number', dataNum);
})

// Close confirm popup
$('.closeBtn').click(function () {
    pop.style.display = "none";
})
$('.delete').click(function () {
    pop.style.display = "none";
})


// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == pop) {
        pop.style.display = "none";
    }
}