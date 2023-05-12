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

app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));

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

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});

module.exports = app;
