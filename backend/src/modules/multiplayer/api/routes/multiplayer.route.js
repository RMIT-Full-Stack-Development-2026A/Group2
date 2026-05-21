const express = require("express");
const router = express.Router();
const {
    getSpectatorMatch,
    getWaitingRooms,
} = require("../controller/multiplayer.controller");
const validateToken = require("../../../../middleware/authenticate");

router.get("/spectate/:token", getSpectatorMatch);
router.get("/rooms", validateToken, getWaitingRooms);

module.exports = router;
