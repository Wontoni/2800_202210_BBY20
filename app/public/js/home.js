"use strict";

// document.getElementById("sign-out").onclick = () => {
//     location.href = "/sign-out";
// };

let aboutLocation = window.innerHeight * 1.55 - 400;
let contactLocation = window.innerHeight * 1.95 - 400;
let serviceLocation = window.innerHeight * 2.35 - 400;

// Show/Hide Homepage elements
$(document).scroll(function() {
    var y = $(this).scrollTop();
    if (y > aboutLocation && y < aboutLocation + 200) {
        $(".aboutUs").fadeIn();
    } else {
        $(".aboutUs").fadeOut();
    }
});

$(document).scroll(function() {
    var y = $(this).scrollTop();
    if (y > contactLocation && y < contactLocation + 200) {
        $(".contactUs").fadeIn();
    } else {
        $(".contactUs").fadeOut();
    }
});

$(document).scroll(function() {
    var y = $(this).scrollTop();
    if (y > serviceLocation - 100) {
        $(".service").fadeIn();
    } else {
        $(".service").fadeOut();
    }
});

//Scroll to elements on click

$(".about").click(function(){
    window.scroll({
        top: aboutLocation + 150,
        left: 0,
        behavior: 'smooth'
    });
})

$(".contact").click(function(){
    window.scroll({
        top: contactLocation + 150,
        left: 0,
        behavior: 'smooth'
    });
})

$(".serve").click(function(){
    window.scroll({
        top: serviceLocation + 150,
        left: 0,
        behavior: 'smooth'
    });
})

