$(document).ready(function() {
    initializePage();
    handleAddToCartButtons();
    handleFormSubmissions();
});


function handleAddToCartButtons() {
    $('.add-to-cart-btn').on('click', function() {
        const productId = $(this).attr('data-product-id');
        addToCart(productId);
    });
}

function addToCart(productId) {
    $.ajax({
        url: '/сart/cart_add',
        type: 'POST',
        data: { productId: productId },
        success: function(response) {
            alert('Product added to cart!');
        },
        error: function() {
            alert('Failed to add product to cart.');
        }
    });
}

function handleFormSubmissions() {
    $('form').on('submit', function(event) {
        event.preventDefault();
        const formData = $(this).serialize();

        $.ajax({
            url: $(this).attr('action'),
            type: 'POST',
            data: formData,
            success: function(response) {
                alert('Form submitted successfully!');
            },
            error: function() {
                alert('Form submission failed.');
            }
        });
    });
}