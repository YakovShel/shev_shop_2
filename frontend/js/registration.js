$(document).ready(function() {
    $('#registration-form').submit(function(event) {
        event.preventDefault();
        registerUser();
    });
});

function registerUser() {
    var formData = {
        first_name: $('#id_first_name').val(),
        last_name: $('#id_last_name').val(),
        username: $('#id_username').val(),
        email: $('#id_email').val(),
        password1: $('#id_password1').val(),
        password2: $('#id_password2').val(),
    };

    $.ajax({
        type: 'POST',
        url: '/user/registration/',
        data: formData,
        success: function(response) {
            alert('Регистрация прошла успешно!');
            window.location.href = '/';
        },
        error: function(response) {
            alert('Ошибка при регистрации. Проверьте введенные данные и попробуйте снова.');
        }
    });
}
