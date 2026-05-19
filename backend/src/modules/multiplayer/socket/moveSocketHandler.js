const gameService = require("../../game/application/services/game.service");
const roomSocketHandler = require("./roomSocketHandler");
const rooms = roomSocketHandler.rooms; 
const multiplayerService = require("../application/services/multiplayer.service")

module.exports = function moveSocketHandler(io, socket) {
  socket.on("makeMove", async ({ roomCode, rowIndex, colIndex }) => {

    try {
      const normalizedCode = String(roomCode || "").toUpperCase();
      const room = rooms.get(normalizedCode);
      if (!room?.sessionId) {
        socket.emit("moveError", { message: "Game session not found." });
        return;
      }

      const dto = await gameService.makeMove(
        socket.user,
        room.sessionId,
        { rowIndex, colIndex }
      );

      io.to(normalizedCode).emit("moveResult", dto);

      if (dto.session.status === "finished") {
        try {
          await multiplayerService.finishRoom(normalizedCode);
        } catch (error) {
          console.error("Failed to finish room:", error.message);
        }
        roomSocketHandler.transitionRoomToFinishedDecision(
          io,
          normalizedCode,
          dto.session.id,
        );
      }

      if (dto.session.status === "aborted") {
        await multiplayerService.closeRoom(normalizedCode);
        room.status = "closed";
        rooms.delete(normalizedCode);
      }

    } catch (error) {
      socket.emit("moveError", { message: error.message });
    }
  });
};
