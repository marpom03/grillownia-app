const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Set up the SQLite database
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create a table (if it doesn't already exist)
// db.run(`
// CREATE TABLE IF NOT EXISTS users (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   username TEXT NOT NULL UNIQUE,
//   password TEXT NOT NULL
// )
// CREATE TABLE IF NOT EXISTS groups (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   name TEXT NOT NULL,
//   owner_id INTEGER NOT NULL,
//   FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
// )
// CREATE TABLE IF NOT EXISTS users_groups (
//   user_id INTEGER,
//   group_id INTEGER,
//   visible_location BOOLEAN NOT NULL DEFAULT 1,
//   PRIMARY KEY (user_id, group_id),
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
//   FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
// )
// CREATE TABLE IF NOT EXISTS location (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   user_id INTEGER NOT NULL,
//   from_date DATETIME NOT NULL,
//   to_date DATETIME NOT NULL,
//   title TEXT NOT NULL,
//   description TEXT,
//   longitude REAL NOT NULL,
//   latitude REAL NOT NULL,
//   public BOOLEAN NOT NULL DEFAULT 0,
//   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
// )
// CREATE TABLE IF NOT EXISTS refresh_tokens (
//   id INTEGER PRIMARY KEY AUTOINCREMENT,
//   token TEXT NOT NULL,
//   user_id INTEGER NOT NULL,
//   expiry_date DATETIME,
//   FOREIGN KEY (user_id) REFERENCES users(id)
// );
//   `);

db.serialize(() => {
  db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

  db.run(`
      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER NOT NULL,
        FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

  db.run(`
      CREATE TABLE IF NOT EXISTS users_groups (
        user_id INTEGER,
        group_id INTEGER,
        visible_location BOOLEAN NOT NULL DEFAULT 1,
        PRIMARY KEY (user_id, group_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
      )
    `);

  db.run(`
      CREATE TABLE IF NOT EXISTS location (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        from_date DATETIME NOT NULL,
        to_date DATETIME NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        longitude REAL NOT NULL,
        latitude REAL NOT NULL,
        public BOOLEAN NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

  db.run(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        expiry_date DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
});

module.exports = db;
