"use strict";

const e = require("express");

$('.delete').click((e) => {
    var userNumber = e.target.dataset.number;
    console.log(userNumber);
    $.ajax({
        method: 'DELETE',
        url: '/delete',
        data: { _id: userNumber}

    }).done((result) => {
        
    });
});

document.querySelector(".edit-button").addEventListener("click", (e) => {
    fetch("/edit", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            _id : e.target.dataset.number
        })
    })
});