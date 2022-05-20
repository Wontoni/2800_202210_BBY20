"use strict";

var moveSpeed = 1000 // Milliseconds

window.addEventListener('load', function () {
    // To open readMoreContent
    $("#readMore").click(function () {
        $("#readMore").toggleClass("hide");
        $("#readMoreContent").toggleClass("hide");
        $("#readLess").toggleClass("hide");
        $("#TOFD").toggleClass("hide");
    })

    // To close readMoreContent
    $("#readLess").click(function () {
        $("#readMore").toggleClass("hide");
        $("#readMoreContent").toggleClass("hide");
        $("#readLess").toggleClass("hide");
        $("#TOFD").toggleClass("hide");
    })

    // To close popup
    $(".closePop").click(function () {
        $("#tipsPop").animate({
            right: "120%"
        }, moveSpeed, function() {
            $("#tipsPop").fadeOut();
        });
    })
})
