"use strict";

window.addEventListener('load', function () {
    var friendsIcon = document.querySelector('.friendsIcon');
    var friendsList = document.querySelector('.friendsList');
    var messages = document.querySelector('.messageContainer');

    friendsIcon.onclick = function() {
        friendsIcon.classList.toggle('close');
        friendsList.classList.toggle('close-friends');
        messages.classList.toggle("close")
    }
})