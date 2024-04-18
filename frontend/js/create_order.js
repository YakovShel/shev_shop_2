document.getElementById('order-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/orders/create-order', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        alert('Заказ успешно оформлен!');
        // Очистить форму или перенаправить пользователя
    })
    .catch(error => console.error('Ошибка при создании заказа:', error));
});

function loadCartItems() {
    fetch('/user/users_cart/')
    .then(response => response.json())
    .then(items => {
        const container = document.getElementById('cart-items-container');
        items.forEach(item => {
            const div = document.createElement('div');
            div.innerHTML = `${item.name} - ${item.quantity} x ${item.price}`;
            container.appendChild(div);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadCartItems();
});

$(document).ready(function() {
    loadCartItems();
    $('#order-form').submit(function(event) {
        event.preventDefault();
        submitOrder();
    });
});

function loadCartItems() {
    $.getJSON('/user/users_cart', function(data) {
        var itemsHtml = data.map(function(item) {
            return '<div class="p-3">' +
                '<strong>' + item.product.name + '</strong>: ' +
                item.quantity + ' x ' + item.product.sell_price +
                '</div>';
        }).join('');
        $('#cart-items-container').html(itemsHtml);
    });
}

function submitOrder() {
    var formData = {
        first_name: $('#first_name').val(),
        last_name: $('#last_name').val(),
        phone_number: $('#phone_number').val(),
        delivery: $('input[name="delivery"]:checked').val(),
        delivery_address: $('#delivery_address').val(),
        payment_method: $('input[name="payment_method"]:checked').val(),
    };
    $.post('/orders/create_order/', formData, function(response) {
        alert('Заказ оформлен: ' + response.order_id);
    }).fail(function() {
        alert('Ошибка при оформлении заказа. Пожалуйста, попробуйте ещё раз.');
    });
}
