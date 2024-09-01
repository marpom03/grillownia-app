const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db/setup-db");
const {
  generateToken,
  authenticateToken,
  saveTokenInDatabase,
  deleteTokenFromDatabase,
} = require("../services/jwt");

// Define a route for getting users
router.get("/", authenticateToken, (req, res) => {
  db.all("SELECT id, username FROM users", async (err, users) => {
    if (err) return res.status(500).json({ error: err.message });
    console.log(users)
    res.json({ users });
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user from the database
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user)
        return res.status(401).json({ error: "Invalid username or password" });

      // Compare the password with the hashed password stored in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ error: "Invalid username or password" });

      // Generate a JWT and send it to the client
      try {
        const out = await saveTokenInDatabase(
          generateToken(user, user.id),
          user.id
        );
        return res.json({ token: out.token });
      } catch (error) {
        return res
          .status(error.status || 500)
          .json({ error: error.error || "Internal Server Error" });
      }
    }
  );
});

// User Registration
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
      "INSERT INTO users (username, password) VALUES (?, ?)"
    );
    stmt.run([username, hashedPassword], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    });
    stmt.finalize();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  const { token } = req.body;
  try {
      deleteTokenFromDatabase(token).then((out) => res.sendStatus(out.status));
  } catch (err) {
    res.status(err.status).json({error: err.error})
  }
});

module.exports = router;
