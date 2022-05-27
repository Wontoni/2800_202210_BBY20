"use strict";

$(document).ready(function(){
    $(".date").click(function() {
        $(".date").removeClass("active");
        $(this).addClass("active");
    });
});

var today = new Date();
var dd = today.getDate();

if (dd < 10) {
    dd = "0" + dd;
}
dd = "2022-05-" + dd;

var element = document.getElementById(dd);
element.scrollIntoView({inline: "center", behavior: "smooth"});
element.className += " active";

$("#next").click(function() {
    $(".dates").animate({scrollLeft: "+=63px"}, 500);
});

$("#prev").click(function() {
    $(".dates").animate({scrollLeft: "-=63px"}, 500);
});

$('.edit').click((e) => {
    var taskNumber = e.target.dataset.number;
    $.ajax({
        method: 'GET',
        url: `/edit-task/${taskNumber}`,
        data: { _id: taskNumber }
    }).done((result) => {
        window.location.href = `/edit-task/${taskNumber}`;
    });
});


