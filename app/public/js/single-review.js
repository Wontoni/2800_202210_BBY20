"use strict";

$('#writeReviewBtn').click((e) => {
    var profNumber = e.target.dataset.number;
    $.ajax({
        method: 'GET',
        url: `/create-review/${profNumber}`,
        data: { _id: profNumber }
    }).done((result) => {
        window.location.href = `/create-review/${profNumber}`;
    }).fail((error) => {
        console.log("error");
    });
});

