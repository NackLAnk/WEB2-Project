const menuCards = document.querySelectorAll('.menu-card1');
const individualMenuCard = document.querySelector('.individual-menu-card');
const individualMenuContent = document.getElementById('individual-menu-content');
const modalBackground = document.getElementById('modal-background');
let isModalOpen = false;

function disableScroll() {
    document.body.style.overflow = 'hidden';
}

// Функция для разблокировки скролла
function enableScroll() {
    document.body.style.overflow = '';
}


menuCards.forEach(menuCard => {
    menuCard.addEventListener('click', (event) => {
        event.stopPropagation();
        if (event.target.closest('.menu-card__add')) {
            return;
        }

        const title = menuCard.querySelector('.menu-card__information-title').innerText;
        const ingredients = menuCard.querySelector('.menu-card__information-ingredients').innerText;
        const price = menuCard.querySelector('.menu-card__information-price span').innerText;
        const image = menuCard.querySelector('.menu-image__settings').getAttribute('src');

        const content = `
            <img src="${image}" alt="${title}">
            <div class="individual-menu-card__information">
            <div>
                <h2 class="individual-title">${title}</h2>
                <p class="individual-ingredients">${ingredients}</p>
            </div>
            <div class="individual-price">
                <p>${price}</p>
            </div>
            </div>
        `;

        individualMenuContent.innerHTML = content;
        individualMenuCard.classList.add('show');
        modalBackground.style.display = 'block';
        isModalOpen = true;
        disableScroll();
    });
});

modalBackground.addEventListener('click', function (event) {
    if (isModalOpen && event.target === modalBackground) {
        individualMenuCard.classList.remove('show');
        modalBackground.style.display = 'none';
        enableScroll();
        isModalOpen = false;
    }
});
