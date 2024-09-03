const express = require("express");
const db = require("../db/setup-db");
const { authenticateToken } = require("../services/jwt");
const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
  // Access the route parameter
  const userId = req.user.id;

  // Fetch data from the database or perform your logic here
  db.all(
    "SELECT * FROM users_groups INNER JOIN groups ON users_groups.group_id = groups.id WHERE user_id = ?",
    [userId],
    (err, row) => {
      if (err) {
        console.error("Error fetching user's groups:", err);
        return res.status(500).json({ error: err.message });
      }

      res.json(row); // Send the group data in the response
    }
  );
});

// required users id list
router.post("/", authenticateToken, (req, res) => {
  const { name, users } = req.body;
  const ownerId = req.user.id;

  if (!name || !ownerId || !Array.isArray(users)) {
    return res.status(400).json({
      error: "Name and userIds are required. userIds should be an array.",
    });
  }

  // Insert the new group into the database
  const stmtInsertGroup = db.prepare(
    "INSERT INTO groups (name, owner_id) VALUES (?, ?)"
  );
  stmtInsertGroup.run(name, ownerId, function (err) {
    if (err) {
      console.error("Error inserting group:", err);
      return res.status(500).json({ error: err.message });
    }

    const groupId = this.lastID;

    // Prepare to insert users into users_groups
    const stmtInsertUsers = db.prepare(
      "INSERT INTO users_groups (user_id, group_id) VALUES (?, ?)"
    );

    // Use a transaction to ensure all inserts are successful
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      try {
        users.forEach((userId) => {
          stmtInsertUsers.run(userId, groupId);
        });

        db.run("COMMIT");
        res.status(201).json({ id: groupId, name, ownerId, users });
      } catch (e) {
        db.run("ROLLBACK");
        console.error("Error inserting users into group:", e);
        res.status(500).json({ error: e.message });
      } finally {
        stmtInsertUsers.finalize();
      }
    });
  });

  stmtInsertGroup.finalize();
});

// user id from JWT, groupId and visible_location from body
router.put("/", authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { groupId, visible_location } = req.body;

  if (typeof visible_location !== "boolean") {
    return res
      .status(400)
      .json({ error: "visible_location must be a boolean" });
  }

  const stmt = db.prepare(`
        UPDATE users_groups
        SET visible_location = ?
        WHERE group_id = ? AND user_id = ?
      `);

  // Execute the SQL statement
  stmt.run(visible_location, groupId, userId, function (err) {
    if (err) {
      console.error("Error updating user's group visibility:", err);
      return res.status(500).json({ error: err.message });
    }

    // Check if any rows were affected
    if (this.changes === 0) {
      return res.status(404).json({ error: "User or group not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Visibility updated successfully" });
  });

  stmt.finalize();
});

module.exports = router;
