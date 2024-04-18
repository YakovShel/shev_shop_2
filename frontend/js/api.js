function loadCartButton() {
    return $('#modal-cart').load('/path/to/your/api-endpoint/cart-button');
}

function loadAboutContent() {
    return $.ajax({
        url: '/catalog/',
        type: 'GET',
        dataType: 'json'
    });
}

function loadCart() {

    $.ajax({
        url: '/user/users_cart/',
        type: 'GET',
        success: function(html) {
            $('#cart-items-container').html(html);
        },
        error: function(err) {
            console.error('Ошибка при загрузке содержимого корзины', err);
        }
    });
}
