const express = require("express");
const adminController = require("./admin.controller");
const authMiddleware = require("../../middleware/authenticate");
const roleMiddleware = require("../../middleware/authorizeRole");

const router = express.Router();

router.use(authMiddleware, roleMiddleware("admin"));

router.get("/stats", adminController.getSystemStats);

router.get("/users", adminController.getAllUsers);

router.get("/users/change-status/:userId", adminController.toggleUserAccountStatus);

module.exports = router;