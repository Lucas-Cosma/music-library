// server.js — Express entry point for the Music Library API

const express = require('express');
const cors    = require('cors');

// Initialise the database connection (also runs model.sql first time)
require('./db');

// Routers
const artistsRoutes = require('./routes/artists');
const albumsRoutes  = require('./routes/albums');
const songsRoutes   = require('./routes/songs');

const app  = express();
const PORT = 5001;

// Middleware
app.use(cors());           // allow the frontend to call us
app.use(express.json());   // parse JSON request bodies

// Mount the routers
app.use('/artists', artistsRoutes);
app.use('/albums',  albumsRoutes);
app.use('/songs',   songsRoutes);

// Friendly root for sanity-checking
app.get('/', (req, res) => {
  res.json({
    message: 'Music Library API is running',
    endpoints: ['/artists', '/albums', '/songs']
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});