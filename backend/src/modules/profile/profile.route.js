const express = require("express");
const profileController = require("./profile.controller");
const authMiddleware = require("../../middleware/authenticate");
const uploadLogo = require("../../middleware/uploadMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", profileController.getProfile);
router.patch("/", profileController.updateProfile);
router.post("/change-password", profileController.changePassword);

router.get("/history", profileController.getMatchHistory);
router.get("/history/:sessionId/replay", profileController.getMatchReplay);
router.patch("/logo", authMiddleware, uploadLogo, profileController.uploadProfileLogo);

module.exports = router;