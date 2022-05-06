"use strict";

document.getElementById("sign-out").onclick = () => {
    location.href = "/sign-out";
};

$("#profilePic").click(function () {
    $(".dropdownProfile").toggleClass("showDrop");
})


// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('#profilePic') && $(".dropdownProfile").hasClass("showDrop") ) {
        $(".dropdownProfile").removeClass("showDrop");
    }
}