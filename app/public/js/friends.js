"use strict";

window.addEventListener('load', function () {
    var friendsIcon = document.querySelector('.friendsIcon');
    var friendsList = document.querySelector('.friendsList');
    var messages = document.querySelector('.messageContainer');

    var friendItem = document.querySelector('.friendItem');

    friendsIcon.onclick = function () {
        friendsIcon.classList.toggle('close');
        friendsList.classList.toggle('close-friends');
        messages.classList.toggle("close")
    }

    $('.friendItem').click(function () {
        $(".friendItem").removeClass("active");
        $(this).attr("class", "friendItem active");
    })
    $('#addFriendSearch').keyup( function() {
        if (this.value.length !== 0) {

            // Change to flex if a horizontal list is desired
            $(".allUsers").css("display", "block");
        }
    })

    $('#addFriendSearch').keyup( function() {
        if (this.value.length === 0) {
            $(".allUsers").css("display", "none");
        }
    })
})