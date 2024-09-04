const jwt = require("jsonwebtoken");
const db = require("../db/setup-db");
const secretKey =
  "FITSy9dGK9BlOOrOqOi3xRaWjMPgR9KQtT0GaPiBaKQ7LcYniHsdsSA78iEy8BmOGAXpkVi7Imp9dZeHfJPptA==";
  
function generateToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" }); 
}

function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return err;
  }
}

function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.sendStatus(403);

  const decodedToken = verifyToken(token);
  if (!decodedToken) return res.sendStatus(403);

  req.user = decodedToken;
  next();
}

function saveTokenInDatabase(token, userID) {
  const expiryDate = new Date(); 
  expiryDate.setHours(expiryDate.getHours() + 1);

  return new Promise((resolve, reject) => {
    const stmt = db.prepare(
      "INSERT INTO refresh_tokens (token, user_id, expiry_date) VALUES (?, ?, ?)"
    );

    stmt.run(token, userID, expiryDate, function (err) {
      if (err) {
        reject({ status: 500, error: err.message });
      } else {
        resolve({ token });
      }
    });

    stmt.finalize();
  });
}

function deleteTokenFromDatabase(token) {
  const stmt = db.prepare("DELETE FROM refresh_tokens WHERE token = ?");
  return new Promise((resolve, reject) => {
    stmt.run(token, function (err) {
      if (err) reject({status: 500, error: err});
      resolve({status:204})
    });
    stmt.finalize();
  });
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  secretKey,
  saveTokenInDatabase,
  deleteTokenFromDatabase,
};
