const express = require("express");
const cors = require("cors");
const app = express();
//const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
//const validateUser = require("./services/validateUser");
const { generateAccessToken, generateRefreshToken } = require("./auth/sign");
const { verifyAccessToken, verifyRefreshToken } = require("./auth/verify");
//const validateToken = require("./auth/validateToken");
const authenticateToken = require("./auth/authenticateToken");
const { jsonResponse } = require("./lib/jsonResponse");
const log = require("./lib/trace");
const getUserInfo = require("./lib/getUserInfo");
require("dotenv").config();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);

  console.log("Conectado a la base de datos");
}

app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));

// Ruta para renovar el token de acceso utilizando el token de actualización
app.post("/api/refresh-token", (req, res) => {
  log.info("POST /api/refresh-token");
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    console.log("No se proporcionó token de actualización", refreshToken);
    return res
      .status(401)
      .json({ error: "Token de actualización no proporcionado" });
  }
  try {
    const payload = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken(getUserInfo(payload.user));
    res.json(jsonResponse(200, { accessToken }));
  } catch (error) {
    return res.status(403).json({ error: "Token de actualización inválido" });
  }
});

// Ruta protegida que requiere autenticación
app.get("/api/posts", authenticateToken, (req, res) => {
  res.json([
    {
      id: 1,
      title: "Lavar los trastes",
      completed: false,
    },
    {
      id: 2,
      title: "Terminar video",
      completed: true,
    },
    {
      id: 3,
      title: "Mandar reporte",
      completed: false,
    },
  ]);
});

app.use("/api/user", authenticateToken, require("./routes/user"));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = app;
