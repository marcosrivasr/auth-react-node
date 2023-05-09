const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

app.post("/api/login", (req, res) => {
  res.json({ response: "login" });
});

app.post("/api/signup", (req, res) => {
  res.json({ response: "signup" });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
