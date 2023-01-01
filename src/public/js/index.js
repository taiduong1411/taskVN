// function currentTime() {
//     let date = new Date();
//     let hh = date.getHours();
//     let mm = date.getMinutes();
//     let ss = date.getSeconds();
//     let session = "AM";

//     if (hh === 0) {
//         hh = 12;
//     }

//     hh = (hh < 10) ? "0" + hh : hh;
//     mm = (mm < 10) ? "0" + mm : mm;
//     // ss = (ss < 10) ? "0" + ss : ss;

//     let time = hh + ":" + mm;

//     document.getElementById("clock").innerText = time;
//     let t = setTimeout(function() { currentTime() }, 1000);
// }

// currentTime();

$(function() {
    $(".menu-link").click(function() {
        $(".menu-link").removeClass("is-active");
        $(this).addClass("is-active");
    });
});

$(function() {
    $(".main-header-link").click(function() {
        $(".main-header-link").removeClass("is-active");
        $(this).addClass("is-active");
    });
});

const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdowns.forEach((c) => c.classList.remove("is-active"));
        dropdown.classList.add("is-active");
    });
});

$(".search-bar input")
    .focus(function() {
        $(".header").addClass("wide");
    })
    .blur(function() {
        $(".header").removeClass("wide");
    });

$(document).click(function(e) {
    var container = $(".status-button");
    var dd = $(".dropdown");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        dd.removeClass("is-active");
    }
});

$(function() {
    $(".dropdown").on("click", function(e) {
        $(".content-wrapper").addClass("overlay");
        e.stopPropagation();
    });
    $(document).on("click", function(e) {
        if ($(e.target).is(".dropdown") === false) {
            $(".content-wrapper").removeClass("overlay");
        }
    });
});

$(function() {
    $(".status-button:not(.open)").on("click", function(e) {
        $(".overlay-app").addClass("is-active");
    });
    $(".pop-up .close").click(function() {
        $(".overlay-app").removeClass("is-active");
    });
});

$(".status-button:not(.open)").click(function() {
    $(".pop-up").addClass("visible");
});

$(".pop-up .close").click(function() {
    $(".pop-up").removeClass("visible");
});

const toggleButton = document.querySelector('.dark-light');

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});