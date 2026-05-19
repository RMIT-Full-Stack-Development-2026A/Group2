const express = require("express");
const router = express.Router();
const {
    getWaitingRooms,
    createSpectatorShareLink,
    getSpectatorMatch,
} = require("../controller/multiplayer.controller");
const validateToken = require("../../../../middleware/authenticate");

router.get("/rooms", validateToken, getWaitingRooms);
router.post("/spectator-links", validateToken, createSpectatorShareLink);
router.get("/spectate/:token", getSpectatorMatch);

module.exports = router;
