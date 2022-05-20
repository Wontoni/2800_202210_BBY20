"use strict";

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
        }, 1000 , function() {
            $("#tipsPop").fadeOut();
        });
    })
})
