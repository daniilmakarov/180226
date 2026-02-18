const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// 1. Подключение к базе (создаст файл database.sqlite автоматически)
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('Ошибка открытия БД:', err.message);
    else console.log('✅ Подключено к SQLite.');
});

// 2. Создаем таблицу, если её еще нет
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.use(cors());
app.use(express.json());

// 3. Маршрут для сохранения имени
app.post('/api/save-name', (req, res) => {
    const userName = req.body.name;

    if (!userName) return res.status(400).send({ message: 'Имя пустое!' });

    const sql = `INSERT INTO users (name) VALUES (?)`;

    db.run(sql, [userName], function(err) {
        if (err) {
            console.error('Ошибка вставки:', err.message);
            return res.status(500).send({ message: 'Ошибка БД' });
        }
        console.log(`✅ Имя "${userName}" сохранено в SQLite (ID: ${this.lastID})`);
        res.status(200).send({ message: 'Готово!' });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер на SQLite запущен: http://localhost:${PORT}`);
});