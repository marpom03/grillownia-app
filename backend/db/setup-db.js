const sqlite3 = require("sqlite3").verbose();
const path = require('path');

// Set up the SQLite database
const db = new sqlite3.Database("./db/database.db", (err) => {
  if (err) {
    console.error("Could not connect to database", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create a table (if it doesn't already exist)
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT NOT NULL
  )`
);

module.exports = db