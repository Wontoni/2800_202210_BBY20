"use strict";

$('.delete').click((e) => {
    var userNumber = e.target.dataset.number;
    $.ajax({
        method: 'DELETE',
        url: '/delete-request',
        data: { _id: userNumber }
    }).done((result) => {
        window.location.href = `/requests`;
    }).fail((error) => {
        console.log("error");
    });
});

$('.check').click((e) => {
    var requestNumber = e.target.dataset.number;
    $.ajax({
        method: 'PUT',
        url: "/check-requests?_method=PUT",
        data: { _id: requestNumber }
    }).done((result) => {
        window.location.href = "/check-requests";
    }).fail((error) => {
        console.log("error");
    });
});