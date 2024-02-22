function disableScroll() {
    document.body.style.overflow = 'hidden';
}

function enableScroll() {
    document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', function () {
    var closeDrawerButton = document.getElementById('closeDrawer');
    var drawer = document.getElementById('drawer');
    var cartLink = document.getElementById('cart');
    var modalBackground = document.getElementById('modal-background'); // Получаем подложку

    // При клике на ссылку "Корзина" открываем шторку и показываем подложку
    cartLink.addEventListener('click', function (event) {
        event.preventDefault(); // Отменяем стандартное поведение ссылки
        drawer.classList.add('open');
        modalBackground.style.display = 'block';
        disableScroll();
    });

    // При клике на кнопку "Закрыть" закрываем шторку и скрываем подложку
    closeDrawerButton.addEventListener('click', function () {
        drawer.classList.remove('open');
        modalBackground.style.display = 'none';
        enableScroll();
    });
});
