module.exports = function chatSocketHandler(io, socket) {
  socket.on("sendMessage", ({ roomCode, message }) => {
    if (!message?.trim()) return;
    socket.to(roomCode).emit("newMessage", {
      message: message.trim(),
      from: "opponent",
    });
  });
};