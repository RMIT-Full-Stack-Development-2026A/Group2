const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router.post("/register", authController.signUp);

module.exports = router;