const express = require("express");
const router = express.Router();
const {
  secretKey,
  verifyToken,
  generateToken,
  saveTokenInDatabase,
} = require("../services/jwt");
const db = require("../db/setup-db");


router.get("/", (req, res) => {
  res.send("Welcome to the Home Page!");
});

router.get("/token", (req, res) => {
  const prevToken = req.query.token;
  console.log(prevToken)
  if (!prevToken) return res.sendStatus(401);
  const stmt = db.prepare("SELECT * FROM refresh_tokens WHERE token = ?");
  stmt.get(prevToken, (err, row) => {
    if (err) return res.sendStatus(500);
    if (!row) return res.sendStatus(403);

    const user = verifyToken(prevToken);
    if (!user) {
      console.error("JWT verification error:", err);
      return res.sendStatus(403);
    }
    saveTokenInDatabase(
      generateToken({
        id: user.id,
        username: user.username,
      }),
      user.id
    ).then((token) => res.json({ token: token.token, username: user.username }));
  });
  stmt.finalize();
});

module.exports = router;
