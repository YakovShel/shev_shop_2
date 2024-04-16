$(document).ready(function() {
    loadCartItems();
    updateCartTotals();

    // Обработка событий для увеличения/уменьшения количества товаров
    $(document).on('click', '.increment', function() {
        changeQuantity($(this).data('cart-id'), 1);
    });

    $(document).on('click', '.decrement', function() {
        changeQuantity($(this).data('cart-id'), -1);
    });

    // Обработка события для удаления товара из корзины
    $(document).on('click', '.remove-from-cart', function() {
        removeFromCart($(this).data('cart-id'));
    });
});

function loadCartItems() {
    $.ajax({
        url: '/user/users-cart',
        type: 'GET',
        dataType: 'json',
        success: function(carts) {
            const container = $('#cart-items-container');
            container.empty();
            $.each(carts, function(index, cart) {
                container.append(`
                    <div class="card-header">
                        <h5 class="card-title">${cart.product.name}</h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <div class="row text-center">
                                <div class="col p-0">
                                    <div class="input-group">
                                        <button type="button" class="btn btn-dark btn-sm decrement" data-cart-id="${cart.id}">
                                            -
                                        </button>
                                        <input type="text" class="form-control number" value="${cart.quantity}" readonly>
                                        <button type="button" class="btn btn-dark btn-sm increment" data-cart-id="${cart.id}">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div class="col p-0">
                                    <p>x ${cart.product.sell_price} = </p>
                                </div>
                                <div class="col p-0"><strong>${cart.products_price} ₽</strong></div>
                                <div class="col p-0">
                                    <button class="btn btn-danger remove-from-cart" data-cart-id="${cart.id}">
                                        <img src="deps/icons/trash3-fill.svg" alt="Remove" width="16" height="16">
                                    </button>
                                </div>
                            </div>
                        </li>
                    </ul>
                `);
            });
            $('#checkout-button').toggle(carts.length > 0);
        }
    });
}

function updateCartTotals() {
    $.ajax({
        url: 'cart/users-cart/',
        type: 'GET',
        dataType: 'json',
        success: function(totals) {
            const totalsContainer = $('#cart-totals');
            totalsContainer.html(`
                <p class="float-left">Итого <strong>${totals.total_quantity}</strong> товар(а) на сумму</p>
                <h4 class="float-left"><strong>${totals.total_price} ₽</strong></h4>
            `);
        }
    });
}

function changeQuantity(cartId, delta) {
    $.ajax({
        url: `/cart/cart_change/`,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ delta: delta }),
        success: function() {
            loadCartItems();
            updateCartTotals();
        }
    });
}

function removeFromCart(cartId) {
    $.ajax({
        url: `/cart/cart_remove/`,
        type: 'DELETE',
        success: function() {
            loadCartItems();
            updateCartTotals();
        }
    });
}
