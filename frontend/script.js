// ============================================================
// Music Library — Frontend JavaScript
// Talks to the Express API at http://localhost:5001
// ============================================================

const API = 'http://localhost:5001';

// ============================================================
// NAVIGATION — switch which <section class="page"> is visible
// ============================================================
const navLinks = document.querySelectorAll('.nav-links a');
const pages    = document.querySelectorAll('.page');

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = link.dataset.page;

    navLinks.forEach((l) => l.classList.remove('active'));
    pages.forEach((p)    => p.classList.remove('active'));

    link.classList.add('active');
    document.getElementById(target).classList.add('active');

    // Refresh the data when the user clicks a tab
    if (target === 'home')    refreshStats();
    if (target === 'artists') loadArtists();
    if (target === 'albums')  loadAlbums();
    if (target === 'songs')   loadSongs();
  });
});

// ============================================================
// HELPERS
// ============================================================
async function api(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    alert(data.error || `Request failed (${res.status})`);
    throw new Error(data.error || res.statusText);
  }
  return data;
}

// ============================================================
// HOME STATS
// ============================================================
async function refreshStats() {
  try {
    const [artists, albums, songs] = await Promise.all([
      api('/artists'),
      api('/albums'),
      api('/songs')
    ]);
    document.getElementById('stat-artists').textContent = artists.length;
    document.getElementById('stat-albums').textContent  = albums.length;
    document.getElementById('stat-songs').textContent   = songs.length;
  } catch (_) {/* error already alerted */}
}

// ============================================================
// ARTISTS — CRUD
// ============================================================
const artistForm     = document.getElementById('artist-form');
const artistIdInput  = document.getElementById('artist-id');
const artistName     = document.getElementById('artist-name');
const artistGenre    = document.getElementById('artist-genre');
const artistList     = document.getElementById('artist-listeners');
const artistSubmit   = document.getElementById('artist-submit');
const artistCancel   = document.getElementById('artist-cancel');
const artistsTbody   = document.getElementById('artists-tbody');

async function loadArtists() {
  const artists = await api('/artists');
  artistsTbody.innerHTML = '';
  artists.forEach((a) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.id}</td>
      <td>${escapeHtml(a.name)}</td>
      <td>${escapeHtml(a.genre || '')}</td>
      <td>${(a.monthly_listeners || 0).toLocaleString()}</td>
      <td class="action-btns">
        <button class="btn-edit"   data-id="${a.id}">Edit</button>
        <button class="btn-delete" data-id="${a.id}">Delete</button>
      </td>
    `;
    tr.querySelector('.btn-edit').addEventListener('click', () => editArtist(a));
    tr.querySelector('.btn-delete').addEventListener('click', () => deleteArtist(a.id));
    artistsTbody.appendChild(tr);
  });

  refreshArtistDropdown();
}

artistForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    name:              artistName.value.trim(),
    genre:             artistGenre.value.trim(),
    monthly_listeners: Number(artistList.value) || 0
  };
  if (artistIdInput.value) {
    await api(`/artists/${artistIdInput.value}`, {
      method: 'PUT',
      body:   JSON.stringify(body)
    });
  } else {
    await api('/artists', {
      method: 'POST',
      body:   JSON.stringify(body)
    });
  }
  resetArtistForm();
  loadArtists();
  loadAlbums();
});

artistCancel.addEventListener('click', resetArtistForm);

function editArtist(a) {
  artistIdInput.value = a.id;
  artistName.value    = a.name;
  artistGenre.value   = a.genre || '';
  artistList.value    = a.monthly_listeners || '';
  artistSubmit.textContent = 'Update Artist';
  artistCancel.classList.remove('hidden');
}

function resetArtistForm() {
  artistForm.reset();
  artistIdInput.value      = '';
  artistSubmit.textContent = 'Add Artist';
  artistCancel.classList.add('hidden');
}

async function deleteArtist(id) {
  if (!confirm('Delete this artist? Their albums and songs will also be removed.')) return;
  await api(`/artists/${id}`, { method: 'DELETE' });
  loadArtists();
  loadAlbums();
  loadSongs();
}

// ============================================================
// ALBUMS — CRUD
// ============================================================
const albumForm    = document.getElementById('album-form');
const albumIdInput = document.getElementById('album-id');
const albumName    = document.getElementById('album-name');
const albumYear    = document.getElementById('album-year');
const albumListens = document.getElementById('album-listens');
const albumArtist  = document.getElementById('album-artist');
const albumSubmit  = document.getElementById('album-submit');
const albumCancel  = document.getElementById('album-cancel');
const albumsTbody  = document.getElementById('albums-tbody');

async function loadAlbums() {
  const albums = await api('/albums');
  albumsTbody.innerHTML = '';
  albums.forEach((a) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${a.id}</td>
      <td>${escapeHtml(a.name)}</td>
      <td>${a.release_year || ''}</td>
      <td>${(a.listens || 0).toLocaleString()}</td>
      <td>${escapeHtml(a.artist_name || '—')}</td>
      <td class="action-btns">
        <button class="btn-edit"   data-id="${a.id}">Edit</button>
        <button class="btn-delete" data-id="${a.id}">Delete</button>
      </td>
    `;
    tr.querySelector('.btn-edit').addEventListener('click', () => editAlbum(a));
    tr.querySelector('.btn-delete').addEventListener('click', () => deleteAlbum(a.id));
    albumsTbody.appendChild(tr);
  });

  refreshAlbumDropdown();
}

albumForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    name:         albumName.value.trim(),
    release_year: Number(albumYear.value) || null,
    listens:      Number(albumListens.value) || 0,
    artist_id:    Number(albumArtist.value)
  };
  if (albumIdInput.value) {
    await api(`/albums/${albumIdInput.value}`, {
      method: 'PUT',
      body:   JSON.stringify(body)
    });
  } else {
    await api('/albums', {
      method: 'POST',
      body:   JSON.stringify(body)
    });
  }
  resetAlbumForm();
  loadAlbums();
  loadSongs();
});

albumCancel.addEventListener('click', resetAlbumForm);

function editAlbum(a) {
  albumIdInput.value = a.id;
  albumName.value    = a.name;
  albumYear.value    = a.release_year || '';
  albumListens.value = a.listens || '';
  albumArtist.value  = a.artist_id;
  albumSubmit.textContent = 'Update Album';
  albumCancel.classList.remove('hidden');
}

function resetAlbumForm() {
  albumForm.reset();
  albumIdInput.value      = '';
  albumSubmit.textContent = 'Add Album';
  albumCancel.classList.add('hidden');
}

async function deleteAlbum(id) {
  if (!confirm('Delete this album? Its songs will also be removed.')) return;
  await api(`/albums/${id}`, { method: 'DELETE' });
  loadAlbums();
  loadSongs();
}

async function refreshArtistDropdown() {
  const artists = await api('/artists');
  const current = albumArtist.value;
  albumArtist.innerHTML = '<option value="">Choose artist…</option>';
  artists.forEach((a) => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = a.name;
    albumArtist.appendChild(opt);
  });
  if (current) albumArtist.value = current;
}

// ============================================================
// SONGS — CRUD
// ============================================================
const songForm    = document.getElementById('song-form');
const songIdInput = document.getElementById('song-id');
const songName    = document.getElementById('song-name');
const songYear    = document.getElementById('song-year');
const songAlbum   = document.getElementById('song-album');
const songSubmit  = document.getElementById('song-submit');
const songCancel  = document.getElementById('song-cancel');
const songsTbody  = document.getElementById('songs-tbody');

async function loadSongs() {
  const songs = await api('/songs');
  songsTbody.innerHTML = '';
  songs.forEach((s) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${escapeHtml(s.name)}</td>
      <td>${s.release_year || ''}</td>
      <td>${escapeHtml(s.album_name  || '—')}</td>
      <td>${escapeHtml(s.artist_name || '—')}</td>
      <td class="action-btns">
        <button class="btn-edit"   data-id="${s.id}">Edit</button>
        <button class="btn-delete" data-id="${s.id}">Delete</button>
      </td>
    `;
    tr.querySelector('.btn-edit').addEventListener('click', () => editSong(s));
    tr.querySelector('.btn-delete').addEventListener('click', () => deleteSong(s.id));
    songsTbody.appendChild(tr);
  });
}

songForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    name:         songName.value.trim(),
    release_year: Number(songYear.value) || null,
    album_id:     Number(songAlbum.value)
  };
  if (songIdInput.value) {
    await api(`/songs/${songIdInput.value}`, {
      method: 'PUT',
      body:   JSON.stringify(body)
    });
  } else {
    await api('/songs', {
      method: 'POST',
      body:   JSON.stringify(body)
    });
  }
  resetSongForm();
  loadSongs();
});

songCancel.addEventListener('click', resetSongForm);

function editSong(s) {
  songIdInput.value = s.id;
  songName.value    = s.name;
  songYear.value    = s.release_year || '';
  songAlbum.value   = s.album_id;
  songSubmit.textContent = 'Update Song';
  songCancel.classList.remove('hidden');
}

function resetSongForm() {
  songForm.reset();
  songIdInput.value       = '';
  songSubmit.textContent  = 'Add Song';
  songCancel.classList.add('hidden');
}

async function deleteSong(id) {
  if (!confirm('Delete this song?')) return;
  await api(`/songs/${id}`, { method: 'DELETE' });
  loadSongs();
}

async function refreshAlbumDropdown() {
  const albums = await api('/albums');
  const current = songAlbum.value;
  songAlbum.innerHTML = '<option value="">Choose album…</option>';
  albums.forEach((a) => {
    const opt = document.createElement('option');
    opt.value = a.id;
    opt.textContent = `${a.name} — ${a.artist_name || '?'}`;
    songAlbum.appendChild(opt);
  });
  if (current) songAlbum.value = current;
}

// ============================================================
// UTILITY: escape user-supplied text before injecting into HTML
// ============================================================
function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

// ============================================================
// INITIAL LOAD
// ============================================================
refreshStats();
loadArtists();
loadAlbums();
loadSongs();