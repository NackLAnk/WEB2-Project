// navbar, logo, profile sticky scroll bar

// Получаем ссылки на элементы, если они существуют
var elements = {
    "navbar-bg": document.getElementById("navbar-bg"),
    "navbar": document.getElementById("navbar"),
    "navbar-login": document.getElementById("navbar-login"),
    "navbar-sign-in": document.getElementById("navbar-sign-in"),
    "navbar-profile": document.getElementById("navbar-profile"),
    "navbar-logo-text": document.getElementById("navbar-logo-text")
};

function scrollFunction() {
    // Определяем цвет текста и фона в зависимости от положения прокрутки
    var textColor = (document.body.scrollTop > 0 || document.documentElement.scrollTop > 0) ? "black" : "white";
    var bgColor = (textColor === "black") ? "white" : "rgba(0, 0, 0, 0)";

    // Применяем стили ко всем элементам
    for (var key in elements) {
        if (elements.hasOwnProperty(key) && elements[key]) {
            // Применяем стили к элементу, если он существует
            switch (key) {
                case "navbar-bg":
                    elements[key].style.backgroundColor = bgColor;
                    elements[key].classList.toggle("sticky--navbar", textColor === "black");
                    break;
                case "navbar":
                case "navbar-login":
                case "navbar-sign-in":
                case "navbar-profile":
                case "navbar-logo-text":
                    elements[key].style.color = textColor;
                    break;
                default:
                    break;
            }
        }
    }
}


// menu sticky scroll bar

let navbar = document.getElementById("container__article-menu");
let shouldStickPosition = navbar.offsetTop;

function addOrRemoveStickyClass() {
    var current = 'container__article-menu';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        const scrollThresholdTop = sectionTop - 170;
        const scrollThresholdBottom = sectionTop + sectionHeight - 45;

        if (window.scrollY >= scrollThresholdTop && window.scrollY < scrollThresholdBottom) {
            current = section.id;
        }
    });

    navbar.classList.remove('sticky');

    if (navbar.id === current) {
        navbar.classList.remove('sticky');
    } else {
        navbar.classList.add('sticky');
    }
}


var header = document.querySelector(".article__menu");
var links = document.querySelectorAll(".container__article-menu__padding");
var sections = document.querySelectorAll('.department');
var menuItems = document.querySelectorAll('.container__article-menu__padding');

function handleScroll() {
    var current = 'home';
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        const scrollThresholdTop = sectionTop - 170;
        const scrollThresholdBottom = sectionTop + sectionHeight - 45;

        if (scrollY >= scrollThresholdTop && scrollY < scrollThresholdBottom) {
            current = section.id;
        }

    });

    menuItems.forEach((item) => {
        item.classList.remove('menu-active');
        var link = item.querySelector('a');
        if (link) {
            var href = link.getAttribute('href');
            if (href && href.includes(current)) {
                item.classList.add("menu-active");
                link.classList.add("text-active");
            } else {
                link.classList.remove("text-active");
            }
        }
    });

    menuItems.forEach((menuItem) => {
        menuItem.addEventListener('click', function (event) {
            event.preventDefault();

            var targetId = this.getAttribute('href').substring(1);
            var targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest', duration: 800 });
            }
        });
    });
}

window.addEventListener('scroll', handleScroll);


window.onscroll = () => {
    scrollFunction();
    addOrRemoveStickyClass();
    handleScroll();
}