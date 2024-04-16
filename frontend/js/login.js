document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('id_username').value;
    const password = document.getElementById('id_password').value;

    fetch('/user/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        // Если статус ответа не успешен, выбросим ошибку
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message);
            });
        }
        // В остальных случаях возвращаем json
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            console.log('Добро пожаловать:', data.message);
            // Дальнейшие действия после успешной авторизации, например:
            // Сохранение id пользователя и статуса is_staff, если требуется
            window.localStorage.setItem('userId', data.id);
            window.localStorage.setItem('isStaff', data.is_staff);
            // Перенаправление на главную страницу или профиль пользователя
            window.location.href = '/';
        } else {
            // Вывод сообщения об ошибке авторизации
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Ошибка авторизации:', error.message);
        alert(error.message); // Вывод сообщения об ошибке пользователю
    });
});
