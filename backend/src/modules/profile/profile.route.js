const express = require("express");
const profileController = require("./profile.controller");
const authMiddleware = require("../../middleware/authenticate");
const uploadLogo = require("../../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", authMiddleware, profileController.getProfile);
router.patch("/", authMiddleware, profileController.updateProfile);
router.post("/change-password", authMiddleware, profileController.changePassword);
router.patch("/logo", authMiddleware, uploadLogo, profileController.uploadProfileLogo);

module.exports = router;
