const express = require("express");
const profileController = require("./profile.controller");
const authMiddleware = require("../../middleware/authenticate");

const router = express.Router();

router.get("/", authMiddleware, profileController.getProfile);
router.patch("/", authMiddleware, profileController.updateProfile);
router.post("/change-password", authMiddleware, profileController.changePassword);

module.exports = router;
