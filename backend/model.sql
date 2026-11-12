-- ============================================================
-- Assignment 5: Music Library — Database schema and seed data
-- ============================================================

-- Artists table
CREATE TABLE IF NOT EXISTS artists (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  name              TEXT    NOT NULL,
  genre             TEXT,
  monthly_listeners INTEGER DEFAULT 0
);

-- Albums table (each album belongs to one artist)
-- ON DELETE CASCADE → deleting an artist removes their albums
CREATE TABLE IF NOT EXISTS albums (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  release_year INTEGER,
  listens      INTEGER DEFAULT 0,
  artist_id    INTEGER NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

-- Songs table (each song belongs to one album)
-- ON DELETE CASCADE → deleting an album removes its songs
CREATE TABLE IF NOT EXISTS songs (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  release_year INTEGER,
  album_id     INTEGER NOT NULL,
  FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

-- Seed data: 2 artists, 5 albums, 10 songs
INSERT INTO artists (name, genre, monthly_listeners) VALUES
  ('Taylor Swift', 'Pop',  85000000),
  ('The Beatles',  'Rock', 28000000);

INSERT INTO albums (name, release_year, listens, artist_id) VALUES
  ('1989',         2014, 5000000, 1),
  ('Folklore',     2020, 3500000, 1),
  ('Midnights',    2022, 6200000, 1),
  ('Abbey Road',   1969, 8000000, 2),
  ('Let It Be',    1970, 4500000, 2);

INSERT INTO songs (name, release_year, album_id) VALUES
  ('Shake It Off',         2014, 1),
  ('Blank Space',          2014, 1),
  ('Cardigan',             2020, 2),
  ('Exile',                2020, 2),
  ('Anti-Hero',            2022, 3),
  ('Lavender Haze',        2022, 3),
  ('Come Together',        1969, 4),
  ('Something',            1969, 4),
  ('Let It Be',            1970, 5),
  ('Across the Universe',  1970, 5);