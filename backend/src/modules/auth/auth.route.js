const express = require("express");
const authController = require("./auth.controller");
const authMiddleware = require("../../middleware/authenticate");

const router = express.Router();

router.post("/register", authController.signUp);
router.post("/login", authController.logIn);
router.get("/profile", authMiddleware, authController.getProfile);
router.patch("/profile", authMiddleware, authController.updateProfile);
router.post("/change-password", authMiddleware, authController.changePassword);
router.post("/logout", authController.logOut);
router.post("/refresh", authController.refresh);

module.exports = router;