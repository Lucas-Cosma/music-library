# Music Library

A full-stack Music Library web application developed as an individual university project.

The application allows users to manage artists, albums and songs through a simple web interface.

## Features

- Dashboard displaying the total number of artists, albums and songs.
- Add, view, edit and delete artists.
- Add, view, edit and delete albums.
- Add, view, edit and delete songs.
- Associate albums with artists.
- Associate songs with albums.
- SQLite database with relational links between records.

## Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- SQLite

## Project Structure

```text
music-library/
├── backend/
│   ├── data/
│   ├── routes/
│   ├── db.js
│   ├── model.sql
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .gitignore
└── README.md
```

## Running the Project

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Start the backend server

```bash
npm start
```

The API runs at `http://localhost:5001`.

### 3. Open the frontend

Open `frontend/index.html` in your browser.

The frontend communicates with the Express backend running on port 5001.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/artists` | Retrieve artists |
| POST | `/artists` | Add an artist |
| PUT | `/artists/:id` | Update an artist |
| DELETE | `/artists/:id` | Delete an artist |
| GET | `/albums` | Retrieve albums |
| POST | `/albums` | Add an album |
| PUT | `/albums/:id` | Update an album |
| DELETE | `/albums/:id` | Delete an album |
| GET | `/songs` | Retrieve songs |
| POST | `/songs` | Add a song |
| PUT | `/songs/:id` | Update a song |
| DELETE | `/songs/:id` | Delete a song |

## Database

The application uses SQLite.

The database is stored locally in `backend/data/app.db`. If no database exists, the application initialises it using `backend/model.sql`, which contains the database schema and starter data.

## Author

**Lucas Cosma**

- [GitHub Profile](https://github.com/Lucas-Cosma)
- [LinkedIn Profile](https://www.linkedin.com/in/lucas-cosma-828867448/)