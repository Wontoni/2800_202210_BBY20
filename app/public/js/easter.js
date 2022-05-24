"use strict";

var moveSpeed = 8000; // Milliseconds -- Animation speed
var delayAnimation = 1000; // Milliseconds -- Initial delay time

//Randomize animation delay in milliseconds
const lowerBound = 20000
const upperBound = 60000
const difference = upperBound - lowerBound;

// Start easter egg sliding
const delayStart = setTimeout(start, delayAnimation);

// Move div off the right of the screen
function moveRight() {
    setTimeout(() => {
        $("#easterEgg").animate({
            left: "3000px"
        }, moveSpeed, function () {
            moveLeft();
        });
    }, delayAnimation
    )
}

// Move div off the left of the screen
function moveLeft() {
    delayAnimation = Math.floor(Math.random() * difference) + lowerBound;
    console.log(delayAnimation);
    setTimeout(() => {
        $("#easterEgg").animate({
            left: "-200px"
        }, moveSpeed, function () {
            delayAnimation = Math.floor(Math.random() * difference) + lowerBound;
            moveRight();
        });
    }, delayAnimation
    )
}

function start() {
    $("#easterEgg").css("display", "block");
    moveRight();
}