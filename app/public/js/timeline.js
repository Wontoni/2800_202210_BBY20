"use strict";

$('.delete').click((e) => {
    var postNumber = e.target.dataset.number;
    $.ajax({
        method: 'DELETE',
        url: '/delete-post',
        data: { _id: postNumber }
    }).done((result) => {
        window.location.href = `/timeline`;
    }).fail((error) => {
        console.log("error");
    });
});

$('.edit').click((e) => {
    var postNumber = e.target.dataset.number;
    $.ajax({
        method: 'GET',
        url: `/edit-post/${postNumber}`,
        data: { _id: postNumber }
    }).done((result) => {
        window.location.href = `/edit-post/${postNumber}`;
    }).fail((error) => {
        console.log("error");
    });
});