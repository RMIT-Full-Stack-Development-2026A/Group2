const gameService = require("../../game/application/services/game.service");
const roomSocketHandler = require("./roomSocketHandler");
const rooms = roomSocketHandler.rooms; 
const multiplayerService = require("../application/services/multiplayer.service")

module.exports = function moveSocketHandler(io, socket) {
  socket.on("makeMove", async ({ roomCode, rowIndex, colIndex }) => {

    try {
      const room = rooms.get(roomCode);
      if (!room?.sessionId) {
        socket.emit("moveError", { message: "Game session not found." });
        return;
      }

      const dto = await gameService.makeMove(
        socket.user,
        room.sessionId,
        { rowIndex, colIndex }
      );

      io.to(roomCode).emit("moveResult", dto);
      io.of("/spectator").to(roomCode).emit("spectatorMoveResult", dto);

      if (dto.session.status === "finished" || dto.session.status === "aborted") {
        await multiplayerService.closeRoom(roomCode);
      }

    } catch (error) {
      socket.emit("moveError", { message: error.message });
    }
  });
};
