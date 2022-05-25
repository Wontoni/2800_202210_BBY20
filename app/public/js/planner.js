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
dd = "date-" + dd;

var element = document.getElementById(dd);
element.scrollIntoView({inline: "center", behavior: "smooth"});
element.className += " active";

$("#next").click(function() {
    $(".dates").animate({scrollLeft: "+=63px"}, 500);
});

$("#prev").click(function() {
    $(".dates").animate({scrollLeft: "-=63px"}, 500);
});


