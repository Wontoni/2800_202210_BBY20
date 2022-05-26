$('.more').click((e) => {
    var postNumber = e.target.dataset.number;
    $.ajax({
        method: 'GET',
        url: `/single-post/${postNumber}`,
        data: { _id: postNumber }
    }).done((result) => {
        window.location.href = `/single-post/${postNumber}`;
    }).fail((error) => {
        console.log("error");
    });
});