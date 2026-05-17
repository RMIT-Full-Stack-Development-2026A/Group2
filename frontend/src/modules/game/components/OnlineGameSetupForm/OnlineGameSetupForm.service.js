import socket from "@/lib/socket";

export function buildOnlineGameNavigationState({
  username,
  roomCode, 
  boardSize, 
  boardStyle,
  customBoardImage,
  marker1, 
  marker2, 
  player1SocketId, 
  player2SocketId,
  myRole, 
  player1Name, 
  player2Name, 
  sessionId, 
  backendSession,
}) {
  return {
    gameType: "online",
    roomCode, 
    boardSize, 
    boardStyle,
    customBoardImage,
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

export function emitCreateRoom({ boardSize, boardStyle, marker1, customBoardImage, useCustomBoard }) {
  socket.emit("createRoom", { 
    boardSize,
    boardStyle: useCustomBoard ? "custom" : boardStyle, 
    marker1, 
    customBoardImage: useCustomBoard ? customBoardImage : null 
  });
}

export function emitJoinRoom(roomCode) {
  socket.emit("joinRoom", { roomCode: roomCode.trim().toUpperCase() });
}

export function emitFindMatch({ boardSize, boardStyle, marker1, customBoardImage, useCustomBoard }) {
  socket.emit("findMatch", { 
    boardSize, 
    boardStyle: useCustomBoard ? "custom" : boardStyle, 
    marker1,
    customBoardImage: useCustomBoard ? customBoardImage : null,
  });
}

export function emitStartGame({ roomCode, marker2 }) {
  socket.emit("startGame", { roomCode, marker2 });
}