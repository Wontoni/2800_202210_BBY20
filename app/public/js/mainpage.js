"use strict";

document.getElementById("sign-out").onclick = () => {
    location.href = "/sign-out";
};

$("#userAvatar").click(function () {
    $(".dropdownProfile").toggleClass("showDrop");
})


// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('#userAvatar') && $(".dropdownProfile").hasClass("showDrop") ) {
        $(".dropdownProfile").removeClass("showDrop");
    }
}