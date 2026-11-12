const db = require('../db');

exports.getAll = (req, res) => {
  const sql = `
    SELECT albums.*, artists.name AS artist_name
    FROM albums
    LEFT JOIN artists ON albums.artist_id = artists.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};

exports.getOne = (req, res) => {
  const sql = `
    SELECT albums.*, artists.name AS artist_name
    FROM albums
    LEFT JOIN artists ON albums.artist_id = artists.id
    WHERE albums.id = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Album not found' });
    res.status(200).json(row);
  });
};

exports.create = (req, res) => {
  const { name, release_year, listens, artist_id } = req.body;
  if (!name || !artist_id) return res.status(400).json({ error: 'name and artist_id are required' });

  const sql = `INSERT INTO albums (name, release_year, listens, artist_id) VALUES (?, ?, ?, ?)`;
  db.run(sql, [name, release_year || null, listens || 0, artist_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      id: this.lastID, name,
      release_year: release_year || null,
      listens: listens || 0,
      artist_id
    });
  });
};

exports.update = (req, res) => {
  const { name, release_year, listens, artist_id } = req.body;
  db.get('SELECT * FROM albums WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Album not found' });

    const updated = {
      name:         name         !== undefined ? name         : row.name,
      release_year: release_year !== undefined ? release_year : row.release_year,
      listens:      listens      !== undefined ? listens      : row.listens,
      artist_id:    artist_id    !== undefined ? artist_id    : row.artist_id
    };

    db.run(
      `UPDATE albums SET name = ?, release_year = ?, listens = ?, artist_id = ? WHERE id = ?`,
      [updated.name, updated.release_year, updated.listens, updated.artist_id, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Album updated successfully', id: Number(req.params.id), ...updated });
      }
    );
  });
};

exports.remove = (req, res) => {
  db.run('DELETE FROM albums WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Album not found' });
    res.status(200).json({ message: 'Album deleted successfully' });
  });
};