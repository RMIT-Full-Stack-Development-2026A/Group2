const multiplayerService = require("../application/services/multiplayer.service");

module.exports = function spectatorSocketHandler(_io, _spectatorNamespace, socket) {
  socket.on("watchMatch", async ({ shareToken } = {}) => {
    try {
      const spectatorMatch =
        await multiplayerService.getSpectatorMatchSnapshotByToken(shareToken);

      socket.join(spectatorMatch.roomCode);
      socket.emit("watchMatchAccepted", {
        roomCode: spectatorMatch.roomCode,
        sessionId: spectatorMatch.sessionId,
      });
    } catch {
      socket.emit("watchMatchError", {
        message:
          "This spectator link is invalid or the match is no longer available.",
      });
      socket.disconnect(true);
    }
  });
};
