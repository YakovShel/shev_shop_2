document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Собираем данные формы
    const formData = {
        first_name: document.getElementById('id_first_name').value,
        last_name: document.getElementById('id_last_name').value,
        username: document.getElementById('id_username').value,
        email: document.getElementById('id_email').value,
        password1: document.getElementById('id_password1').value,
        password2: document.getElementById('id_password2').value,
    };

    // Отправляем запрос на регистрацию
    fetch('/user/registration/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            console.log('Регистрация успешна:', data.message);
            // Перенаправление на страницу входа или профиль пользователя
            window.location.href = 'login.html';
        } else {
            alert(data.message); // Вывод сообщения об ошибке
        }
    })
    .catch(error => {
        console.error('Ошибка регистрации:', error.message);
        alert(error.message); // Вывод сообщения об ошибке пользователю
    });
});
