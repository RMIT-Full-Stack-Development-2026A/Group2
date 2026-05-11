import socket from "@/lib/socket";

export function buildOnlineGameNavigationState({
  username, roomCode, boardSize, boardStyle,
  marker1, marker2, player1SocketId, player2SocketId,
  myRole, player1Name, player2Name, sessionId, backendSession,
}) {
  return {
    gameType: "online",
    roomCode,
    boardSize,
    boardStyle,
    marker1,
    marker2,
    player1: player1Name || (myRole === "player1" ? username : "Opponent"),
    player2: player2Name || (myRole === "player2" ? username : "Opponent"),
    player1SocketId,
    player2SocketId,
    myRole,
    sessionId,
    backendSession
  };
}

export function emitCreateRoom({ boardSize, boardStyle, marker1, marker2 }) {
  socket.emit("createRoom", { boardSize, boardStyle, marker1, marker2 });
}

export function emitJoinRoom(roomCode) {
  const code = roomCode.trim().toUpperCase();
  socket.emit("joinRoom", { roomCode: code });
}

export function emitFindMatch({ boardSize, boardStyle, marker1, marker2 }) {
  socket.emit("findMatch", { boardSize, boardStyle, marker1, marker2 });
}