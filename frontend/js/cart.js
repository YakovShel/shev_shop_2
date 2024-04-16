$(document).ready(function() {
    var successMessage = $("#jq-notification");

    function loadCartItems() {
        $.ajax({
            url: "/user/users_cart/",
            type: "GET",
            success: function(response) {
                $("#cart-items-container").html(response.html);
                $("#goods-in-cart-count").text(response.total_quantity);
            },
            error: function() {
                alert("Ошибка при загрузке данных корзины.");
            }
        });
    }

    loadCartItems();

    $(document).on("click", ".add-to-cart", function(e) {
        e.preventDefault();
        var product_id = $(this).data("product-id");
        $.ajax({
            type: "POST",
            url: "/cart/add_cart/",
            data: JSON.stringify({ product_id: product_id }),
            contentType: 'application/json',
            success: function(data) {
                loadCartItems();
                successMessage.text(data.message).fadeIn(400).delay(7000).fadeOut(400);
            },
            error: function() {
                alert("Ошибка при добавлении товара в корзину.");
            }
        });
    });

    $(document).on("click", ".remove-from-cart", function(e) {
        e.preventDefault();
        var cart_id = $(this).data("cart-id");
        $.ajax({
            type: "POST",
            url: "/cart/cart_remove/",
            data: JSON.stringify({ cart_id: cart_id }),
            contentType: 'application/json',
            success: function(data) {
                loadCartItems();
                successMessage.text(data.message).fadeIn(400).delay(7000).fadeOut(400);
            },
            error: function() {
                alert("Ошибка при удалении товара из корзины.");
            }
        });
    });

    $('#modalButton').click(function() {
        $('#exampleModal').modal('show');
    });
});