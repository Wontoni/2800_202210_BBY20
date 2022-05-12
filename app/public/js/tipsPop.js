"use strict";

$("#readMore").click(function (){
    $("#readMore").toggleClass("hide");
    $("#readMoreContent").toggleClass("hide");
    $("#readLess").toggleClass("hide");
})

$("#readLess").click(function (){
    $("#readMore").toggleClass("hide");
    $("#readMoreContent").toggleClass("hide");
    $("#readLess").toggleClass("hide");
})

function getRandomInt(upperBound) {
    // Exclusive upperBound
    return Math.floor(Math.random() * upperBound);
  }

let tips = [
    ["Get into a routine", "Getting into a routine lets you get used to studying, and helps make the transition to post-secondary much easier!"],
    ["Use class time wisely", "To maximize what you learn, you should be taking notes, reading lectures before hand, and creating flash cards!"],
    ["Study everyday", "To make sure you don't have an information overload, try to study your notes a little bit whenever you're free!"],
    ["Meditate or Exercise", "Meditating and exercising are a great way to keep your body healthy, and several studies say they help with studying as well!"]
]

$("#createPopup").click(function(){
    let tipNo = getRandomInt(tips.length);
    let tipTitle = tips[tipNo][0];
    let tipDesc = tips[tipNo][1];

    let popupDiv = document.createElement("div");
    popupDiv.setAttribute('class', "tipsPop")

    let x = document.createTextNode("Tip of the day: ")

    let tipTitleDiv = document.createElement("div");
    tipTitleDiv.setAttribute('id', 'TOFD');
    let titleText = document.createTextNode(tipTitle);
    tipTitleDiv.appendChild(titleText);

    let tipSeeMore = document.createElement("div");
    tipSeeMore.setAttribute('id', 'readMore');
    let seeMoreText = document.createTextNode("See more");
    tipSeeMore.appendChild(seeMoreText);

    let tipDescDiv = document.createElement("div");
    tipDescDiv.setAttribute('id', 'readMoreContent');
    tipDescDiv.setAttribute('class', 'hide');
    let descText = document.createTextNode(tipDesc);
    tipDescDiv.appendChild(descText);

    let tipSeeLess = document.createElement("div");
    tipSeeLess.setAttribute('id', 'readLess');
    tipSeeLess.setAttribute('class', 'hide');
    let seeLessText = document.createTextNode("See less");
    tipSeeLess.appendChild(seeLessText);

    popupDiv.appendChild(x);
    popupDiv.appendChild(tipTitleDiv);
    popupDiv.appendChild(tipSeeMore);
    popupDiv.appendChild(tipDescDiv);
    popupDiv.appendChild(tipSeeLess);
    document.body.appendChild(popupDiv);
})