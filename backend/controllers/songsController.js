const db = require('../db');

exports.getAll = (req, res) => {
  const sql = `
    SELECT songs.*,
           albums.name  AS album_name,
           artists.name AS artist_name
    FROM songs
    LEFT JOIN albums  ON songs.album_id   = albums.id
    LEFT JOIN artists ON albums.artist_id = artists.id
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(rows);
  });
};

exports.getOne = (req, res) => {
  const sql = `
    SELECT songs.*,
           albums.name  AS album_name,
           artists.name AS artist_name
    FROM songs
    LEFT JOIN albums  ON songs.album_id   = albums.id
    LEFT JOIN artists ON albums.artist_id = artists.id
    WHERE songs.id = ?
  `;
  db.get(sql, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Song not found' });
    res.status(200).json(row);
  });
};

exports.create = (req, res) => {
  const { name, release_year, album_id } = req.body;
  if (!name || !album_id) return res.status(400).json({ error: 'name and album_id are required' });

  const sql = `INSERT INTO songs (name, release_year, album_id) VALUES (?, ?, ?)`;
  db.run(sql, [name, release_year || null, album_id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({
      id: this.lastID, name,
      release_year: release_year || null,
      album_id
    });
  });
};

exports.update = (req, res) => {
  const { name, release_year, album_id } = req.body;
  db.get('SELECT * FROM songs WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Song not found' });

    const updated = {
      name:         name         !== undefined ? name         : row.name,
      release_year: release_year !== undefined ? release_year : row.release_year,
      album_id:     album_id     !== undefined ? album_id     : row.album_id
    };

    db.run(
      `UPDATE songs SET name = ?, release_year = ?, album_id = ? WHERE id = ?`,
      [updated.name, updated.release_year, updated.album_id, req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Song updated successfully', id: Number(req.params.id), ...updated });
      }
    );
  });
};

exports.remove = (req, res) => {
  db.run('DELETE FROM songs WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Song not found' });
    res.status(200).json({ message: 'Song deleted successfully' });
  });
};