const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db/setup-db");
const { generateToken, verifyToken } = require("./services/jwt");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// User Registration
app.post("/register", async (req, res) => {
  const { name, password } = req.body;

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10);

  const stmt = db.prepare(
    "INSERT INTO users (username, password) VALUES (?, ?)"
  );
  stmt.run([name, hashedPassword], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

// User Login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Retrieve the user from the database
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user)
      return res.status(401).json({ error: "Invalid username or password" });

    // Compare the password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid username or password" });

    // Generate a JWT and send it to the client
    const token = generateToken(user);
    res.json({ token });
  });
});

// Middleware to protect routes
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(403);

  const decodedToken = verifyToken(token.split(" ")[1]);
  if (!decodedToken) return res.sendStatus(403);

  req.user = decodedToken;
  next();
}

// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is a protected route!` });
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Express SQLite API!");
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Close the database connection when the server is stopped
process.on("SIGINT", () => {
  db.close(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});
