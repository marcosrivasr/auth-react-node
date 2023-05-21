const express = require("express");
const User = require("../schema/user");
const { jsonResponse } = require("../lib/jsonResponse");
const router = express.Router();

router.post("/", async function (req, res, next) {
  console.log("lol", req.body);
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return next(new Error("username and password are required"));
  }

  try {
    const user = new User();
    const userExists = await user.usernameExists(username);

    if (userExists) {
      return next(new Error("user already exists"));
    } else {
      const user = new User({ username, password, name });

      //const accessToken = generateAccessToken(username);
      //const refreshToken = generateRefreshToken(username);

      user.save();

      res.json(
        jsonResponse(200, {
          message: "User created successfully",
        })
      );
    }
  } catch (err) {
    return next(new Error(err.message));
  }
});

module.exports = router;
