// jwt.js
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key'; // This should be an environment variable

// Function to generate a JWT
function generateToken(user) {
  // Payload can include more information as needed
  const payload = {
    id: user.id,
    username: user.username
  };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token valid for 1 hour
}

// Function to verify a JWT
function verifyToken(token) {
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };
