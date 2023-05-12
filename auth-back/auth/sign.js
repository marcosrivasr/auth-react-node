const jwt = require("jsonwebtoken");
require("dotenv").config();

function sign(payload, isAccessToken) {
  return jwt.sign(
    payload,
    isAccessToken
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: 3600,
    }
  );
}

// Función para generar un token de acceso utilizando jsonwebtoken
function generateAccessToken(user) {
  return sign({ username: user }, true);
}
function generateRefreshToken(user) {
  return sign({ username: user }, false);
}

module.exports = { generateAccessToken, generateRefreshToken };
