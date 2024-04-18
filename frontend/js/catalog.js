
function setupPagination(currentPage, totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';  // Clear existing pagination links

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.textContent = i;
        pageLink.addEventListener('click', function(e) {
            e.preventDefault();
            updatePage(i);
        });
        pageItem.appendChild(pageLink);
        paginationContainer.appendChild(pageItem);
    }
}

function updatePage(pageNumber) {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('page', pageNumber);
    history.pushState(null, '', '?' + urlParams.toString());
    fetchProducts();
}

function loadCartItems() {
    fetch('/api/cart-items')
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
    $.getJSON('/api/cart', function(data) {
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
    $.post('/api/orders/create', formData, function(response) {
        alert('Заказ оформлен: ' + response.order_id);
    }).fail(function() {
        alert('Ошибка при оформлении заказа. Пожалуйста, попробуйте ещё раз.');
    });

$(document).ready(function(){
    // Apply filters using Ajax
    $("#apply-filters").click(function(){
        $.ajax({
            type: "GET",
            url: $("#filter-form").attr("action"),
            data: $("#filter-form").serialize(),
            success: function(response){
                // Update content with filtered data
                $(".row").html($(response).find(".row").html());
            },
            error: function(xhr, textStatus, errorThrown){
                console.log("Error:", errorThrown);
            }
        });
    });
});
}
document.addEventListener('DOMContentLoaded', function() {
    fetchProducts();  // Load initial products or based on URL query parameters
});

function fetchProducts() {
    const url = new URL('/api/products', window.location.origin);
    const params = {
        on_sale: document.getElementById('on_sale').checked ? 'on' : '',
        order_by: document.querySelector('input[name="order_by"]:checked').value,
        q: new URLSearchParams(window.location.search).get('q')  // Handling the search query from URL
    };
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayProducts(products) {
    const container = document.getElementById('search-results');
    container.innerHTML = '';  // Clear previous results
    if (products.length === 0) {
        container.innerHTML = '<h2>По вашему запросу ничего не найдено!</h2>';
        return;
    }
    products.forEach(product => {
        const productCard = `
            <div class="col-lg-4 col-md-6 p-4">
                <div class="card border-primary rounded custom-shadow">
                    <img src="${product.image || 'frontend/images/Not found image.png'}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <a href="/catalog/product/${product.slug}">
                            <p class="card-title">${product.headline || product.name}</p>
                        </a>
                        <p class="card-text">${product.bodyline || product.description.substring(0, 100)}</p>
                        <p class="product_id">id: ${product.display_id}</p>
                        <div class="d-flex justify-content-between">
                            ${product.discount ? `<p><s>${product.price}</s> ₽</p><p><strong>${product.sell_price}</strong> ₽</p><span class="badge bg-warning text-dark">Скидка ${product.discount} %</span>` : `<p><strong>${product.price} ₽</strong></p>`}
                            <a href="#" class="btn add-to-cart" data-product-id="${product.id}" onclick="addToCart(${product.id})">
                                <img class="mx-1" src="{% static 'deps/icons/cart-plus.svg' %}" alt="Cart Icon" width="32" height="32">
                            </a>
                        </div>
                    </div>
                </div>
            </div>`;
        container.innerHTML += productCard;
    });
}

function applyFilters(event) {
    event.preventDefault();  // Prevent the form from causing a page reload
    fetchProducts();
}


