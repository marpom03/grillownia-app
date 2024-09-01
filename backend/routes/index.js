const express = require("express");
const router = express.Router();
const {
  secretKey,
  verifyToken,
  generateToken,
  saveTokenInDatabase,
  deleteTokenFromDatabase,
} = require("../services/jwt");
const db = require("../db/setup-db");

// Define a simple route
router.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

router.get("/token", (req, res) => {
  const prevToken = req.query.token;
  if (!prevToken) return res.sendStatus(401);
  const stmt = db.prepare("SELECT * FROM refresh_tokens WHERE token = ?");
  stmt.get(prevToken, (err, row) => {
    if (err) return res.sendStatus(500);
    if (!row) return res.sendStatus(403); // Token not found

    const user = verifyToken(prevToken);
    if (!user) {
      console.error("JWT verification error:", err);
      return res.sendStatus(403);
    }
    deleteTokenFromDatabase(prevToken);
    saveTokenInDatabase(
      generateToken({
        id: user.id,
        username: user.username,
      }),
      user.id
    ).then((token) => res.json({ token: token.token }));
  });
  stmt.finalize();
});

module.exports = router;
