const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db/setup-db");
const app = express();
const { authenticateToken } = require("./services/jwt")
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Import routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const groupsRouter = require('./routes/groups');
const locationRouter = require('./routes/location');

// Use routes
app.use('/', indexRouter);           // Home route
app.use('/users', usersRouter);      // Users route
app.use('/groups', groupsRouter);    // Groups route
app.use('/location', locationRouter); // Location route

// Protected route example
app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is a protected route!` });
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
