const multiplayerService = require("../application/services/multiplayer.service");

module.exports = function spectatorSocketHandler(_spectatorNamespace, socket) {
  socket.on("watchMatch", async ({ shareToken } = {}) => {
    try {
      const match = await multiplayerService.getSpectatorWatchTarget(shareToken);

      socket.join(match.roomCode);
      socket.data.spectator = true;
      socket.data.roomCode = match.roomCode;

      socket.emit("watchMatchAccepted", {
        roomCode: match.roomCode,
        sessionId: match.sessionId,
      });
    } catch (error) {
      socket.emit("watchMatchError", {
        message:
          error?.message || "This spectator link is invalid or no longer available.",
      });
    }
  });
};
