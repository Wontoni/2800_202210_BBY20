"use strict";

$('.delete').click((e) => {
    var userNumber = e.target.dataset.number;
    $.ajax({
        method: 'DELETE',
        url: '/delete',
        data: { _id: userNumber}

    }).done((result) => {
        
    });
});