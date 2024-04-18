$(document).ready(function() {
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        var username = $('#username').val();
        var password = $('#password').val();

        $.ajax({
            type: 'POST',
            url: '/user/login',
            data: {
                username: username,
                password: password
            },
            success: function(response) {
                alert('Успешная авторизация!');
                window.location.href = '/';
            },
            error: function() {
                alert('Ошибка авторизации. Проверьте введенные данные.');
            }
        });
    });

    $('.login-google, .login-facebook, .login-github').on('click', function() {
        alert('Вход через социальные сети ещё не реализован.');
    });
});
