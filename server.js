const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());

const db = new sqlite3.Database('./vetclinica.db', (err) => {
    if (err) console.error('Помилка підключення:', err.message);
    else console.log('Успішно підключено до vetclinica.db');
});

// GET - отримати всіх тварин
app.get('/animals', (req, res) => {
    db.all('SELECT * FROM animals', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// POST - додати тварину
app.post('/animals', (req, res) => {
    const { name, species, owner_id } = req.body;
    db.run('INSERT INTO animals (name, species, owner_id) VALUES (?, ?, ?)',
        [name, species, owner_id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Тварину додано', id: this.lastID });
        });
});

// PUT - оновити тварину
app.put('/animals/:id', (req, res) => {
    const { name, species } = req.body;
    const { id } = req.params;
    db.run('UPDATE animals SET name=?, species=? WHERE animal_id=?',
        [name, species, id], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Тварину оновлено' });
        });
});

// DELETE - видалити тварину
app.delete('/animals/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM animals WHERE animal_id=?', id, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Тварину видалено' });
    });
});

app.listen(3000, () => console.log('Сервер працює на порту 3000'));