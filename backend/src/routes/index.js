const authRouter = require("../modules/auth/auth.route");
const gameRouter = require("../modules/game/api/routes/game.route");
const multiplayerRouter = require("../modules/multiplayer/api/routes/multiplayer.route");

module.exports = { authRouter, gameRouter, multiplayerRouter };