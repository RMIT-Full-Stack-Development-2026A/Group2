const authRouter = require("../modules/auth/auth.route");
const adminRouter = require("../modules/admin/admin.route");
const gameRouter = require("../modules/game/api/routes/game.route");
const profileRouter = require("../modules/profile/profile.route");

module.exports = { authRouter, adminRouter, gameRouter, profileRouter };
