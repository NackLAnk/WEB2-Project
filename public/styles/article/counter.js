document.addEventListener("DOMContentLoaded", function () {
    const menuIcons = document.querySelectorAll(".menu-card__add");

    menuIcons.forEach(function (icon) {
        const plusIcon = icon.querySelector(".plus-icon");
        const minusIcon = icon.querySelector(".minus-icon");
        const counter = icon.querySelector(".counter");
        const countElement = counter.querySelector(".count");
        const MAX_ORDERS = 5;

        plusIcon.addEventListener("click", function () {
            let count = parseInt(countElement.textContent);
            if (count < MAX_ORDERS) {
                count++;
                countElement.textContent = count;
                counter.style.display = "inline-block";
                minusIcon.style.display = "";

                const productData = getProductData(icon); // Получаем данные о продукте
                addToOrderPanel(productData); // Добавить продукт в шторку заказов
                updateOrderInfo();
            }
        });

        minusIcon.addEventListener("click", function () {
            let count = parseInt(countElement.textContent);
            if (count > 0) {
                count--;
                countElement.textContent = count;
                removeFromOrderPanel(icon); // Удалить продукт из шторки заказов
                updateOrderInfo();
            }
            if (count === 0) {
                counter.style.display = "none";
                plusIcon.style.display = "";
                minusIcon.style.display = "none";
            }
        });

    });

    function getProductData(icon) {
        const menuCard = icon.closest('.menu-card');
        const menuId = icon.parentNode.querySelector('.menu_id').innerText;
        const title = menuCard.querySelector('.menu-card__information-title').innerText;
        const ingredients = menuCard.querySelector('.menu-card__information-ingredients').innerText;
        const price = menuCard.querySelector('.menu-card__information-price span').innerText.replace(/\s/g, '');
        const image = menuCard.querySelector('.menu-image__settings').getAttribute('src');

        return { menuId, title, ingredients, price, image };
    }

    let totalOrderPrice = 0;

    function addToOrderPanel(productData) {
        const orderItems = document.querySelectorAll('.order-item');
        let found = false;

        orderItems.forEach(item => {
            const titleElement = item.querySelector('p:first-child');
            if (titleElement.innerText === productData.title) {
                const countElement = item.querySelector('span:nth-child(2) span');
                let count = parseInt(countElement.textContent);
                count++;
                countElement.textContent = count; // Обновляем содержимое счетчика
                found = true;
            }
        });

        if (!found) {
            const orderPanel = document.querySelector('.drawer__orders');
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.dataset.menuId = productData.menuId; // Устанавливаем атрибут data-menu-id
            orderItem.innerHTML = `
                <div class="order__container">
                    <img src="${productData.image}">
                    <div class="order__information">
                        <p class="text-bold">${productData.title}</p>
                        <span class="order--count"><span>1</span></span>
                    </div>
                </div>
            `;
            orderPanel.appendChild(orderItem);
        }

        totalOrderPrice += parseInt(productData.price);
        updateOrderInfo();
    }

    function removeFromOrderPanel(icon) {
        const productMenuId = icon.parentNode.querySelector('.menu_id').innerText.trim();

        // Ищем элемент в шторке заказов по его уникальному идентификатору
        const orderItemToRemove = document.querySelector(`.order-item[data-menu-id="${productMenuId}"]`);

        if (orderItemToRemove) {
            // Удаляем элемент из DOM
            const countElement = orderItemToRemove.querySelector('span:nth-child(2) span');
            let count = parseInt(countElement.textContent);
            count--;

            if (count === 0) {
                orderItemToRemove.remove();
            } else {
                countElement.textContent = count; // Обновляем количество в DOM
            }

            const productPriceElement = icon.parentNode.querySelector('.menu-card__information-price span');

            if (productPriceElement) {
                const productPriceText = productPriceElement.innerText.trim();

                if (productPriceText !== '') {
                    const productPrice = parseInt(productPriceText.replace(/\s/g, ''));

                    if (!isNaN(productPrice) && productPrice > 0) {
                        totalOrderPrice -= productPrice;
                    }
                }
            }

            updateOrderInfo();
        }
    }


    function updateOrderInfo() {
        const totalPriceSpan = document.querySelector('.total__price');
        totalPriceSpan.textContent = totalOrderPrice;
        const totalPriceSpan2 = document.querySelector('.total__price2');
        totalPriceSpan2.textContent = totalOrderPrice;
    }
});
