$(document).ready(function() {
    loadProducts();

    function loadProducts() {
        $.ajax({
            url: '/catalog/',
            type: 'GET',
            success: function(data) {
                renderProducts(data.products);
                renderPagination(data.pagination);
            },
            error: function() {
                $('#product-list').html('<p>Произошла ошибка при загрузке данных.</p>');
            }
        });
    }

    function renderProducts(products) {
        let productsHtml = '';
        products.forEach(product => {
            productsHtml += `
                <div class="col-lg-4 col-md-6 p-4">
                    <div class="card border-primary rounded custom-shadow">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <a href="product.html?product=${product.slug}">
                                <h5 class="card-title">${product.name}</h5>
                            </a>
                            <p class="card-text">${product.description}</p>
                            <p>${product.price} ₽</p>
                            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">В корзину</button>
                        </div>
                    </div>
                </div>`;
        });
        $('#product-list').html(productsHtml);
    }

    function renderPagination(pagination) {
        let paginationHtml = '<nav aria-label="Page navigation"><ul class="pagination">';
        if (pagination.hasPrevious) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${pagination.previousPage}">Назад</a></li>`;
        }
        pagination.pages.forEach(page => {
            paginationHtml += `<li class="page-item ${page.isActive ? 'active' : ''}"><a class="page-link" href="?page=${page.number}">${page.number}</a></li>`;
        });
        if (pagination.hasNext) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${pagination.nextPage}">Далее</a></li>`;
        }
        paginationHtml += '</ul></nav>';
        $('#pagination').html(paginationHtml);
    }

    function applyFilters() {
        const onSale = $('#on_sale').is(':checked');
        const orderBy = $('input[name="order_by"]:checked').val();
        loadProducts({ onSale, orderBy });
    }

    function loadProducts(filters = {}) {
        $.ajax({
            url: '/catalog/',
            type: 'GET',
            data: {
                on_sale: filters.onSale ? 'on' : 'off',
                order_by: filters.orderBy || 'default'
            },
            success: function(data) {
                renderProducts(data.products);
                renderPagination(data.pagination);
            },
            error: function() {
                $('#product-list').html('<p>Произошла ошибка при загрузке данных.</p>');
            }
        });
    }

    window.applyFilters = applyFilters;
});
