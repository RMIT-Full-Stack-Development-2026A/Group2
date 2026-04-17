const gameService = require("../../game/application/services/game.service");
const roomSocketHandler = require("./roomSocketHandler");
const rooms = roomSocketHandler.rooms; 

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
    } catch (error) {
      socket.emit("moveError", { message: error.message });
    }
  });
};