"use strict";

var pop = document.getElementById("confirmPopup");

// Open confirm popup
$('.deleteBtn').click(function (e) {
    pop.style.display = "flex";

    var dataNum = e.target.dataset.number;
    $('#confirmBtn').attr('data-number', dataNum);
    console.log(dataNum);
})

// Close confirm popup
$('.close').click(function () {
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