"use strict";

$('.delete').click((e) => {
    var userNumber = e.target.dataset.number;
    $.ajax({
        method: 'DELETE',
        url: '/delete-professor',
        data: { _id: userNumber }
    }).done((result) => {
        window.location.href = `/professors`;
    }).fail((error) => {
        console.log("error");
    });
});

$('.edit').click((e) => {
    var profNumber = e.target.dataset.number;
    $.ajax({
        method: 'GET',
        url: `/edit-professor/${profNumber}`,
        data: { _id: profNumber }
    }).done((result) => {
        window.location.href = `/edit-professor/${profNumber}`;
    });
});

document.getElementById("create-button").addEventListener("click", () => {
    fetch("/create-professor", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            "name" : document.getElementById("profName").value,
            "school" : document.getElementById("profSchool").value,
        })
    }).then((res) => {
        return res.json();
    }).then((data) => {
        document.getElementById("profName").value = null;
        document.getElementById("profSchool").value = null;
        document.getElementById("create-message").innerHTML = data.message;
    }).catch(() => {
        window.location.href = "/professors";
    });
});