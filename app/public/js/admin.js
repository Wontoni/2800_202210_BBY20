"use strict";

$('.delete').click((e) => {
    var userNumber = e.target.dataset.number;
    $.ajax({
        method: 'DELETE',
        url: '/delete',
        data: { _id: userNumber }
    }).done((result) => {
        window.location.href = `/main`;
    }).fail((error) => {
        console.log("error");
    });
});

$('.edit').click((e) => {
    var userNumber = e.target.dataset.number;
    $.ajax({
        method: 'GET',
        url: `/edit/${userNumber}`,
        data: { _id: userNumber }
    }).done((result) => {
        window.location.href = `/edit/${userNumber}`;
    }).fail((error) => {
        console.log("error");
    });
});

document.getElementById("create-button").addEventListener("click", () => {
    fetch("/create", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "username" : document.getElementById("userName").value,
            "email" : document.getElementById("userEmail").value,
            "password" : document.getElementById("userPassword").value
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("userName").value = null;
        document.getElementById("userEmail").value = null;
        document.getElementById("userPassword").value = null;
        document.getElementById("create-message").innerHTML = data.message;
    }).catch(() => {
        window.location.href = "/main";
    });
});