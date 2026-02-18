document.getElementById('nameForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Чтобы страница не перезагружалась

    const name = document.getElementById('userName').value;
    const messageDiv = document.getElementById('message');

    try {
        // Отправляем данные на локальный сервер (порт 3000)
        const response = await fetch('http://localhost:3000/api/save-name', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name })
        });

        if (response.ok) {
            messageDiv.innerText = "Имя успешно отправлено!";
            messageDiv.style.color = "green";
        } else {
            messageDiv.innerText = "Ошибка при отправке.";
            messageDiv.style.color = "red";
        }
    } catch (error) {
        console.error('Ошибка:', error);
        messageDiv.innerText = "Сервер не отвечает.";
    }
});