const express = require("express");
const controller = require("../../controllers/game.controller");
const authenticate = require("../../../../middleware/authenticate");

const router = express.Router();

router.use(authenticate);

router.post("/sessions/local", controller.createLocalGame);
router.post("/sessions/single-player", controller.createSinglePlayerGame);
router.get("/sessions/:id", controller.getSession);
router.post("/sessions/:id/moves", controller.makeMove);
router.post("/sessions/:id/abort", controller.abortGame);

module.exports = router;