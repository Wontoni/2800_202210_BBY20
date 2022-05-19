"use strict";


$('.delete').click((e) => {
    var userNumber = e.target.dataset.number;
    console.log(userNumber);
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