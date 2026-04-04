const express = require("express");
const authController = require("./auth.controller");

const router = express.Router();

router.post("/register", authController.signUp);
router.post("/login", authController.logIn);
router.post("/logout", authController.logOut);

module.exports = router;