const express = require("express");
const cors = require("cors");
const db = require("./db/setup-db");
const app = express();
const { authenticateToken } = require("./services/jwt")
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const groupsRouter = require('./routes/groups');
const locationRouter = require('./routes/location');

app.use('/', indexRouter);           
app.use('/users', usersRouter);     
app.use('/groups', groupsRouter);   
app.use('/location', locationRouter); 

app.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, this is a protected route!` });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => {
  db.close(() => {
    console.log("Database connection closed");
    process.exit(0);
  });
});
