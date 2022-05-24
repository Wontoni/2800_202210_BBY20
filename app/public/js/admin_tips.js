"use strict";

$('.delete').click((e) => {
    var userNumber = e.target.dataset.number;
    console.log(userNumber);
    $.ajax({
        method: 'DELETE',
        url: '/delete-tip',
        data: { _id: userNumber }
    }).done((result) => {
        window.location.href = `/tips`;
    }).fail((error) => {
        console.log("error");
    });
});

$('.edit').click((e) => {
    var tipNumber = e.target.dataset.number;
    $.ajax({
        method: 'GET',
        url: `/edit-tips/${tipNumber}`,
        data: { _id: tipNumber }
    }).done((result) => {
        window.location.href = `/edit-tips/${tipNumber}`;
    }).fail((error) => {
        console.log("error");
    });
});

document.getElementById("create-button").addEventListener("click", () => {
    fetch("/tip-create", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "title" : document.getElementById("tipTitle").value,
            "description" : document.getElementById("tipDescription").value,
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("tipTitle").value = null;
        document.getElementById("tipDescription").value = null;
        document.getElementById("create-message").innerHTML = data.message;
    }).catch(() => {
        window.location.href = "/tips";
    });
});