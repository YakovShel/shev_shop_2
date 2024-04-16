$(document).ready(function() {
    loadUserProfile();
    loadCartItems();
    loadOrders();

    $('#profile-form').submit(function(event) {
        event.preventDefault();
        updateProfile();
    });
});

function loadUserProfile() {
    // AJAX запрос для получения данных пользователя
    $.ajax({
        url: '/user/profile',  // Предполагаемый endpoint API
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $('#id_first_name').val(data.firstName);
            $('#id_last_name').val(data.lastName);
            $('#id_username').val(data.username);
            $('#id_email').val(data.email);
            $('#user-image').attr('src', data.image || 'frontend/images/baseavatar.jpg');
        },
        error: function() {
            alert('Ошибка загрузки данных профиля.');
        }
    });
}

function loadCartItems() {
    // AJAX запрос для загрузки содержимого корзины
    $.ajax({
        url: '/user/users-cart/',
        type: 'GET',
        dataType: 'json',
        success: function(items) {
            const container = $('#cart-items-container');
            container.empty();
            items.forEach(item => {
                container.append(`
                    <div class="card mb-3">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="${item.product.image}" class="card-img" alt="${item.product.name}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${item.product.name}</h5>
                                    <p class="card-text">${item.quantity} x ${item.product.price} ₽</p>
                                    <p class="card-text"><small class="text-muted">Всего: ${item.totalPrice} ₽</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
            });
        },
        error: function() {
            alert('Ошибка загрузки корзины.');
        }
    });
}

function loadOrders() {
    // AJAX запрос для загрузки заказов пользователя
    $.ajax({
        url: '/orders/',
        type: 'GET',
        dataType: 'json',
        success: function(orders) {
            const accordion = $('#orders-container');
            accordion.empty();
            orders.forEach((order, index) => {
                accordion.append(`
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${order.id}">
                            <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${order.id}" aria-expanded="${index === 0}" aria-controls="collapse${order.id}">
                                Заказ №${order.id} - ${order.created_timestamp} | Статус: <strong class="mx-2">${order.status}</strong>
                            </button>
                        </h2>
                        <div id="collapse${order.id}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${order.id}" data-bs-parent="#accordionExample">
                            <div class="accordion-body">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Товар</th>
                                            <th>Количество</th>
                                            <th>Цена</th>
                                            <th>Общая стоимость</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${order.items.map(item => `
                                            <tr>
                                                <td><a href="/product/${item.product.id}">${item.product.name}</a></td>
                                                <td>${item.quantity}</td>
                                                <td>${item.price} ₽</td>
                                                <td>${item.total} ₽</td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                `);
            });
        },
        error: function() {
            alert('Ошибка загрузки заказов.');
        }
    });
}

function updateProfile() {
    var formData = new FormData($('#profile-form')[0]);
    $.ajax({
        url: '/user/profile',  // Предполагаемый endpoint API
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(response) {
            alert('Профиль успешно обновлен!');
        },
        error: function() {
            alert('Ошибка при обновлении профиля.');
        }
    });
}