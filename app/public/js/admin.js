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
        url: `/edit-user/${userNumber}`,
        data: { _id: userNumber }
    }).done((result) => {
        window.location.href = `/edit-user/${userNumber}`;
    }).fail((error) => {
        console.log("error");
    });
});