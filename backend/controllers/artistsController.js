const db = require('../db');

exports.getAll = (req, res) => {
  db.all('SELECT * FROM artists', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};

exports.getOne = (req, res) => {
  db.get('SELECT * FROM artists WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Artist not found' });
    res.status(200).json(row);
  });
};

exports.create = (req, res) => {
  const { name, genre, monthly_listeners } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });

  const sql = `INSERT INTO artists (name, genre, monthly_listeners) VALUES (?, ?, ?)`;
  db.run(sql, [name, genre || null, monthly_listeners || 0], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      id: this.lastID, name,
      genre: genre || null,
      monthly_listeners: monthly_listeners || 0
    });
  });
};

exports.update = (req, res) => {
  const { name, genre, monthly_listeners } = req.body;
  db.get('SELECT * FROM artists WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Artist not found' });

    const updated = {
      name:              name              !== undefined ? name              : row.name,
      genre:             genre             !== undefined ? genre             : row.genre,
      monthly_listeners: monthly_listeners !== undefined ? monthly_listeners : row.monthly_listeners
    };

    db.run(
      `UPDATE artists SET name = ?, genre = ?, monthly_listeners = ? WHERE id = ?`,
      [updated.name, updated.genre, updated.monthly_listeners, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Artist updated successfully', id: Number(req.params.id), ...updated });
      }
    );
  });
};

exports.remove = (req, res) => {
  db.run('DELETE FROM artists WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Artist not found' });
    res.status(200).json({ message: 'Artist deleted successfully' });
  });
};