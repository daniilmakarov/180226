const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// БАЗА ДАННЫХ (Файл будет жить на сервере)
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) console.error('Ошибка БД:', err.message);
    else console.log('✅ База SQLite подключена и работает');
});

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// --- МАРШРУТЫ ---

// 1. Главная страница (Форма)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. Страница админки
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// 3. Сохранение имени в базу
app.post('/api/save-name', (req, res) => {
    const userName = req.body.name;
    if (!userName) return res.status(400).send({ message: 'Нет имени' });

    db.run(`INSERT INTO users (name) VALUES (?)`, [userName], function(err) {
        if (err) return res.status(500).send(err.message);
        res.status(200).send({ message: 'Имя сохранено в базу!' });
    });
});

// 4. API для получения списка имен (для админки)
app.get('/api/names', (req, res) => {
    // Сортируем DESC, чтобы последние записи были сверху
    db.all("SELECT * FROM users ORDER BY created_at DESC", [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});
