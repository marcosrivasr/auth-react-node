const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validateUser = require("./services/validateUser");
const { generateAccessToken, generateRefreshToken } = require("./auth/sign");
const { verifyAccessToken, verifyRefreshToken } = require("./auth/verify");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(
    "mongodb+srv://marcos:yYJgmlJedjUMLvJU@todoist.bseyv9j.mongodb.net/?retryWrites=true&w=majority"
  );

  console.log("Conectado a la base de datos");
}

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (validateUser(username, password)) {
    // Genera un token de acceso utilizando jsonwebtoken
    const token = generateAccessToken(username); // "secreto" debería ser una cadena secreta más segura en un entorno real
    const refreshToken = generateRefreshToken(username); // "secreto" debería ser una cadena secreta más segura en un entorno real

    // Devuelve el token al cliente
    res.json({ token, refreshToken });
  } else {
    res.status(401).json({ error: "Credenciales inválidas" });
  }
});

app.post("/api/signup", (req, res) => {
  res.json({ response: "signup" });
});

// Ruta para renovar el token de acceso utilizando el token de actualización
app.post("/refresh-token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ error: "Token de actualización no proporcionado" });
  }
  try {
    const user = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ username: user.username });
    res.json({ accessToken });
  } catch (error) {
    return res.status(403).json({ error: "Token de actualización inválido" });
  }
});

// Ruta protegida que requiere autenticación
app.get("/api/posts", authenticateToken, (req, res) => {
  res.json({ mensaje: "Ruta protegida" });
});

// Middleware para autenticar el token en las solicitudes protegidas
function authenticateToken(req, res, next) {
  let token = null;
  try {
    token = validateToken(req.headers);
  } catch (error) {
    if (error.message === "Token not provided") {
      return res.status(401).json({ error: "Token no proporcionado" });
    }
    if (error.message === "Token format invalid") {
      return res.status(401).json({ error: "Token mal formado" });
    }
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token inválido", token);
    return res.status(403).json({ error: "Token inválido" });
  }
}

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
