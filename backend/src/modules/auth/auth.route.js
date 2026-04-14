const express = require("express");
const authController = require("./auth.controller");
const authMiddleware = require("../../middleware/authenticate");

const router = express.Router();

router.post("/register", authController.signUp);
router.post("/login", authController.logIn);
router.get("/profile", authMiddleware, (req, res) => {
    res.json({status: "success", user: req.user});
});
router.post("/logout", authController.logOut);
router.post("/refresh", authController.refresh);

module.exports = router;