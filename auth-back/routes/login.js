const express = require("express");
const User = require("../schema/user");
//const Token = require("../model/tokenmodel");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../auth/sign");
const { jsonResponse } = require("../lib/jsonResponse");
const getUserInfo = require("../lib/getUserInfo");
//const { jsonResponse } = require("../lib/jsonresponse");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const router = express.Router();

router.post("/", async function (req, res, next) {
  console.log("login++++++++++++++++++++");
  const { username, password } = req.body;

  try {
    let user = new User();
    const userExists = await user.usernameExists(username);
    console.log("1", { userExists });
    if (userExists) {
      user = await User.findOne({ username: username });
      console.log("2", { user });
      const passwordCorrect = await user.isCorrectPassword(
        password,
        user.password
      );

      if (passwordCorrect) {
        const userInfo = {
          id: user._id,
          username: user.username,
          name: user.name,
        };
        const accessToken = generateAccessToken(getUserInfo(user));
        const refreshToken = generateRefreshToken(getUserInfo(user));

        console.log({ accessToken, refreshToken });

        // Establece la cookie en la respuesta
        /* res.cookie("accessToken", accessToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 15 * 60 * 1000),
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        }); */

        return res.json(
          jsonResponse(200, {
            accessToken,
            refreshToken,
          })
        );
      } else {
        return next(new Error("username and/or password incorrect"));
      }
    } else {
      return next(new Error("user does not exist"));
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
