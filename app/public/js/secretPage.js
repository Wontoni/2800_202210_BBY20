"use strict";

window.addEventListener('load', function () {

})

function checkWord() {
    var text = document.querySelector('#secret-word').value;

    var wrongWord = document.querySelector('#wrong-word');


    if (text.toLowerCase() === "college") {
        location.href = "https://www.youtube.com/watch?v=DLzxrzFCyOs";
    } else {
        wrongWord.classList.toggle('hide');
    }

}

function closePopup() {
    var wrongWord = document.querySelector('#wrong-word');
    wrongWord.classList.toggle('hide');
}