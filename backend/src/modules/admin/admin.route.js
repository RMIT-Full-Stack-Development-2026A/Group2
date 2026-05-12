const express = require("express");
const adminController = require("./admin.controller");
const authMiddleware = require("../../middleware/authenticate");
const roleMiddleware = require("../../middleware/authorizeRole");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/stats", adminController.getSystemStats);

router.get("/users", adminController.getAllUsers);

router.get("/users/change-status/:userId", adminController.toggleUserAccountStatus);

router.get("/online-lobbies", adminController.getAllLobbies);

router.get("/online-lobbies/close/:roomId", adminController.closeLobby);

module.exports = router;