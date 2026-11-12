// db.js — opens (or creates) the SQLite database in data/app.db
// and runs model.sql the first time the file is created.

const sqlite3 = require('sqlite3').verbose();
const fs      = require('fs');
const path    = require('path');

// Make sure the data/ folder exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath    = path.join(dataDir, 'app.db');
const isFreshDb = !fs.existsSync(dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log(`Connected to SQLite database (data/app.db).`);

  db.run('PRAGMA foreign_keys = ON;');

  if (isFreshDb) {
    const sqlPath = path.join(__dirname, 'model.sql');
    const sql     = fs.readFileSync(sqlPath, 'utf-8');
    db.exec(sql, (err) => {
      if (err) {
        console.error('Error running model.sql:', err.message);
      } else {
        console.log('Database initialised from model.sql (seed data inserted).');
      }
    });
  } else {
    console.log('Existing database loaded — skipping model.sql.');
  }
});

module.exports = db;