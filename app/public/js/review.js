"use strict";

$('.text').click((e) => {
    var profNumber = e.target.dataset.number;
    $.ajax({
        method: 'GET',
        url: `/single-review/${profNumber}`,
        data: { _id: profNumber }
    }).done((result) => {
        window.location.href = `/single-review/${profNumber}`;
    });
});
