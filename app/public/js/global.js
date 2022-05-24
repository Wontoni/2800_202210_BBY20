window.addEventListener('load', function () {
    var icon = document.querySelector('.menu-icon');
    var menu = document.querySelector('.navbar')

    icon.onclick = function() {
        icon.classList.toggle('open');
        menu.classList.toggle('navbar-open');
    }
})