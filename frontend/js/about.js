$(document).ready(function() {
    loadCartButton().fail(function(err) {
        console.error('Ошибка при загрузке кнопки корзины', err);
    });

    loadAboutContent().then(function(data) {
        $('#content').html(`
            <h2 class="m-2"><strong>${data.content}</strong></h2>
            <p class="m-2">${data.text_on_page}</p>
        `);
    }).fail(function(err) {
        console.error('Ошибка при загрузке контента', err);
    });
});

