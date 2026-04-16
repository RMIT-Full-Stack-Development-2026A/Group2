const express = require("express");
const authController = require("./auth.controller");
const profileController = require("../profile/profile.controller");
const authMiddleware = require("../../middleware/authenticate");

const router = express.Router();

router.post("/register", authController.signUp);
router.post("/login", authController.logIn);
router.post("/logout", authController.logOut);
router.post("/refresh", authController.refresh);
// Backward-compatible aliases while profile module is separated.
router.get("/profile", authMiddleware, profileController.getProfile);
router.patch("/profile", authMiddleware, profileController.updateProfile);
router.post(
  "/change-password",
  authMiddleware,
  profileController.changePassword,
);

module.exports = router;