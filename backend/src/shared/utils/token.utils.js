const jwt = require("jsonwebtoken");

// Access + refresh JWT; payload has user id and role.
const ACCESS_TOKEN_TTL = "15m";
const REFRESH_TOKEN_TTL = "7d";

function generateAccessToken(userId, role) {
  const payload = { id: userId, role };
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL,
  });
}

function generateRefreshToken(userId, role) {
  const payload = { id: userId, role };
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  });
}

function validateRefreshToken(token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  validateRefreshToken,
};
