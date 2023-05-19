const express = require("express");
const User = require("../schema/user");
const jwt = require("jsonwebtoken");
const { jsonResponse } = require("../lib/jsonResponse");
const log = require("../lib/trace");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;
const router = express.Router();

router.get("/", async function (req, res, next) {
  log.info("user", req.user);

  res.json(jsonResponse(200, req.user));
});

module.exports = router;
