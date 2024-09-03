const express = require("express");
const { authenticateToken } = require("../services/jwt");
const router = express.Router();
const db = require("../db/setup-db");
// Define a route for getting locations - TO BE TESTED
router.get("/visible", authenticateToken, (req, res) => {
    const userId = req.user.id;
  
    const query = `
      SELECT DISTINCT l.*
      FROM location l
      LEFT JOIN users u ON l.user_id = u.id
      LEFT JOIN users_groups ug ON u.id = ug.user_id
      LEFT JOIN groups g ON ug.group_id = g.id
      LEFT JOIN users_groups ug2 ON g.id = ug2.group_id
      WHERE 
          l.public = 1
          OR (
              ug2.user_id = ? AND ug.visible_location = 1
          )
    `;
  
    db.all(query, [userId], (err, locations) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ locations });
    });
  });

// REQUIRES TESTING 
// required: user_id from JWT | from, to, description. longtitude, latitude, public, title in req.body
// Transforms to date format to match DATETIME in SQLite (YYYY-MM-DD HH:MM:SS)
router.post("/", authenticateToken, (req, res) => {
  const { title, from, to, latitude, longitude, public = false, description = ''} = req.body;
  const userId = req.user.id

  if (!title || !from || !to || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ error: "Missing one of required data: title, from, to, latitude, longitude" });
  }

  const lat = parseFloat(latitude);
  const long = parseFloat(longitude);
  if (isNaN(lat) || isNaN(long)) {
    return res.status(400).json({ error: "Latitude and longitude must be numbers" });
  }

  const fromDateTime = new Date(from).toISOString().slice(0, 19).replace('T', ' ');
  const toDateTime = new Date(to).toISOString().slice(0, 19).replace('T', ' ');

  const stmt = db.prepare(
    "INSERT INTO location (user_id, title, from_date, to_date, latitude, longitude, public, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  stmt.run([userId, title, fromDateTime, toDateTime, lat, long, public, description], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

module.exports = router;
