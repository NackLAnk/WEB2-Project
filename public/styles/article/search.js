document.getElementById('searchInput').addEventListener('input', function() {
    searchMenu();
});

function searchMenu() {
    var searchText = document.getElementById('searchInput').value.toLowerCase();
    var menuCards = document.querySelectorAll('.menu-card');

    menuCards.forEach(function(card) {
        var title = card.querySelector('.menu-card__information-title').innerText.toLowerCase();
        var ingredients = card.querySelector('.menu-card__information-ingredients').innerText.toLowerCase();
        var departmentId = card.closest('.department').id.toLowerCase(); // Получаем id отдела

        if (title.includes(searchText) || ingredients.includes(searchText) || departmentId.includes(searchText)) {
            card.style.display = 'flex';
            card.closest('.department').style.display = 'block'; // Показываем отдел, если есть совпадение
        } else {
            card.style.display = 'none';
            // Проверяем, остались ли видимые карточки в отделе, и скрываем отдел, если нет
            var departmentCards = card.closest('.department').querySelectorAll('.menu-card[style="display: flex;"]');
            if (departmentCards.length === 0) {
                card.closest('.department').style.display = 'none';
            }
        }
    });
}