$(document).ready(function() {
    const productId = $('#product-data').data('product-id');

    if (productId) {
        loadProductDetails(productId);

        $('#add-to-cart').click(function() {
            addToCart(productId);
        });
    } else {
        console.log('Product ID is missing');
    }
    loadProductDetails(productId);

    $('#add-to-cart').click(function() {
        addToCart(productId);
    });
});

function loadProductDetails(productId) {
    $.ajax({
        url: `/ctalog/product/${productId}`,
        type: 'GET',
        success: function(data) {
            $('#product-id').text('id: ' + data.display_id);
            $('#product-name').text(data.name);
            $('#product-description').text(data.description);
            $('#product-price').text('Цена: ' + data.sell_price + '₽');
            if (data.image) {
                $('#product-image').attr('src', data.image.url);
                $('#modal-product-image').attr('src', data.image.url);
            }
            $('#imageModal1Label').text(data.name);
        },
        error: function() {
            alert('Ошибка загрузки данных продукта.');
        }
    });
}

function addToCart(productId) {
    $.ajax({
        url: '/cart/cart_add',
        method: 'POST',
        data: { product_id: productId },
        success: function(response) {
            alert('Продукт добавлен в корзину!');
        },
        error: function() {
            alert('Ошибка при добавлении в корзину.');
        }
    });
}
