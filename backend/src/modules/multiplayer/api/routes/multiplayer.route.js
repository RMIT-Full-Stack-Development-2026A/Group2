const express = require("express");
const router = express.Router();
const { getWaitingRooms } = require("../controller/multiplayer.controller");
const validateToken = require("../../../../middleware/authenticate");

router.get("/rooms", validateToken, getWaitingRooms);

module.exports = router;