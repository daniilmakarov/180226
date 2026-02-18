const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();

// 1. ПОРТ: Используем системный порт от Render или 3000 для локалки
const PORT = process.env.PORT || 3000;

// 2. БАЗА ДАННЫХ: Создаем файл базы в текущей папке
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('Ошибка подключения к БД:', err.message);
    else console.log('✅ База SQLite готова к работе');
});

// Создаем таблицу, если её нет
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// 3. МИДЛВАРЫ
app.use(cors());
app.use(express.json());
// Позволяем серверу отдавать статические файлы (html, js, css) из корня проекта
app.use(express.static(path.join(__dirname)));

// 4. МАРШРУТЫ
// Отдаем index.html при заходе на главную страницу
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Сохранение имени в базу
app.post('/api/save-name', (req, res) => {
    const userName = req.body.name;

    if (!userName) {
        return res.status(400).send({ message: 'Имя не пришло!' });
    }

    const sql = `INSERT INTO users (name) VALUES (?)`;
    db.run(sql, [userName], function(err) {
        if (err) {
            console.error('Ошибка при записи:', err.message);
            return res.status(500).send({ message: 'Ошибка базы данных' });
        }
        console.log(`✅ Имя "${userName}" сохранено в базу (ID: ${this.lastID})`);
        res.status(200).send({ message: 'Успешно сохранено!' });
    });
});

// 5. ЗАПУСК
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
