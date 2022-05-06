"use strict";

let aboutLocation = window.innerHeight * 1.55 - 400;
let contactLocation = window.innerHeight * 1.95 - 400;
let serviceLocation = window.innerHeight * 2.35 - 400;

// Show/Hide Homepage elements
$(document).scroll(function() {
    var y = $(this).scrollTop();

    if (y > 0){ 
        $(".homeNav").css("box-shadow", "0px 10px 10px grey");
    } else {
        $(".homeNav").css("box-shadow", "none");
    }

    if (y > aboutLocation && y < aboutLocation + 200) {
        $(".aboutUs").fadeIn();
    } else {
        $(".aboutUs").fadeOut();
    }

    if (y > contactLocation && y < contactLocation + 200) {
        $(".contactUs").fadeIn();
    } else {
        $(".contactUs").fadeOut();
    }

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

$(".logo").click(function(){
    window.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
})

