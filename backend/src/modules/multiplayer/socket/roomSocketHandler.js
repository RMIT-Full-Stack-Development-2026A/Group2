const { v4: uuidv4 } = require("uuid");
const multiplayerService = require("../application/services/multiplayer.service");
const { createGameInterface } = require("../../game/domain/interfaces/game.interface");

const rooms = new Map();
const REMATCH_RESPONSE_TIMEOUT_MS = 30000;
const gameInterface = createGameInterface();

function normalizeRoomCode(roomCode) {
  return String(roomCode || "").trim().toUpperCase();
}

function isRoomPlayer(room, socketId) {
  return room?.player1 === socketId || room?.player2 === socketId;
}

function getOpponentSocketId(room, socketId) {
  if (room?.player1 === socketId) return room.player2;
  if (room?.player2 === socketId) return room.player1;
  return null;
}

function clearRematchTimer(room) {
  if (room?.rematchTimer) {
    clearTimeout(room.rematchTimer);
    room.rematchTimer = null;
  }
}

function leaveSocketRoom(io, roomCode, socketId) {
  const memberSocket = io.sockets.sockets.get(socketId);
  if (memberSocket) {
    memberSocket.leave(roomCode);
  }
}

function removePlayersFromRoom(io, roomCode, room) {
  if (!room) return;
  leaveSocketRoom(io, roomCode, room.player1);
  leaveSocketRoom(io, roomCode, room.player2);
}

function buildRoomState({
  roomCode,
  boardSize,
  boardStyle,
  marker1,
  customBoardImage,
  player1,
  player1User,
  player2 = null,
  player2User = null,
  status = "waiting",
}) {
  return {
    roomCode,
    boardSize,
    boardStyle,
    marker1,
    customBoardImage: customBoardImage || null,
    player1,
    player1User,
    player2,
    player2User,
    status,
    sessionId: null,
    marker2: null,
    lastFinishedSessionId: null,
    rematchRequestedBy: null,
    rematchTimer: null,
  };
}

function broadcastRoomList(io) {
  const openRooms = [...rooms.values()].filter((r) => r.status === "waiting");
  io.emit("roomListUpdated", openRooms);
}

function emitRoomClosed(io, roomCode, reason = "closed_by_admin") {
  const normalizedCode = normalizeRoomCode(roomCode);
  if (!normalizedCode) return;

  io.to(normalizedCode).emit("roomClosed", {
    roomCode: normalizedCode,
    reason,
  });

  io.of("/spectator").to(normalizedCode).emit("roomClosed", {
    roomCode: normalizedCode,
    reason,
  });

  const room = rooms.get(normalizedCode);
  if (room) {
    clearRematchTimer(room);
    room.status = "closed";
  }

  broadcastRoomList(io);
}

async function closeRoomAfterPostMatch(io, roomCode, room, payload) {
  clearRematchTimer(room);

  if (room) {
    room.status = "closing";
  }

  io.to(roomCode).emit("rematchDeclined", {
    roomCode,
    reason: payload.reason,
    message: payload.message,
  });
  io.of("/spectator").to(roomCode).emit("roomClosed", {
    roomCode,
    reason: payload.reason,
  });

  try {
    await multiplayerService.finishRoom(roomCode);
  } catch (error) {
    console.error("Failed to finish room:", error.message);
  }

  removePlayersFromRoom(io, roomCode, room);
  rooms.delete(roomCode);
  broadcastRoomList(io);
}

function startRoomDecisionTimer(io, roomCode, room, reason = "timeout") {
  clearRematchTimer(room);
  room.rematchTimer = setTimeout(() => {
    const currentRoom = rooms.get(roomCode);
    if (!currentRoom || currentRoom.status === "closed") return;

    closeRoomAfterPostMatch(io, roomCode, currentRoom, {
      reason,
      message:
        reason === "timeout"
          ? "The rematch request expired. This room has been closed."
          : "Your opponent did not accept the rematch. This room has been closed.",
    });
  }, REMATCH_RESPONSE_TIMEOUT_MS);
}

async function terminateActiveRoom(io, roomCode, room, actorSocketId, reason) {
  clearRematchTimer(room);

  if (!room || room.status === "closing" || room.status === "closed") {
    return;
  }

  room.status = "closing";

  const sessionId = room.sessionId || null;
  if (sessionId) {
    try {
      await gameInterface.terminateOnlineSession(sessionId);
    } catch (error) {
      console.error("Failed to terminate online session:", error.message);
    }
  }

  try {
    await multiplayerService.closeRoom(roomCode);
  } catch (error) {
    console.error("Failed to close room:", error.message);
  }

  const opponentReason =
    reason === "player_left" ? "opponent_left" : "opponent_disconnected";
  const opponentMessage =
    reason === "player_left"
      ? "The other player left the match. This room has been closed."
      : "The other player disconnected. This match has ended.";

  if (actorSocketId && io.sockets.sockets.get(actorSocketId)) {
    io.to(actorSocketId).emit("onlineMatchTerminated", {
      roomCode,
      sessionId,
      reason: reason === "player_left" ? "you_left" : "you_disconnected",
      message:
        reason === "player_left"
          ? "You left the match. This room has been closed."
          : "You disconnected. This match has ended.",
    });
  }

  const opponentSocketId = getOpponentSocketId(room, actorSocketId);
  if (opponentSocketId) {
    io.to(opponentSocketId).emit("onlineMatchTerminated", {
      roomCode,
      sessionId,
      reason: opponentReason,
      message: opponentMessage,
    });
  }

  if (reason === "player_disconnected") {
    io.of("/spectator").to(roomCode).emit("playerDisconnected", {
      roomCode,
    });
  } else {
    io.of("/spectator").to(roomCode).emit("roomClosed", {
      roomCode,
      reason,
    });
  }

  removePlayersFromRoom(io, roomCode, room);
  rooms.delete(roomCode);
  broadcastRoomList(io);
}

function transitionRoomToFinishedDecision(io, roomCode, sessionId) {
  const room = rooms.get(normalizeRoomCode(roomCode));
  if (!room) return;

  clearRematchTimer(room);
  room.status = "finished_waiting_decision";
  room.lastFinishedSessionId = sessionId || room.sessionId || null;
  room.rematchRequestedBy = null;
  startRoomDecisionTimer(io, room.roomCode, room);
}

async function startRematch(io, oldRoomCode, room) {
  clearRematchTimer(room);

  const nextRoomCode = uuidv4().slice(0, 6).toUpperCase();

  await multiplayerService.createRoom(room.player1User, {
    roomCode: nextRoomCode,
    boardSize: room.boardSize,
    boardStyle: room.boardStyle,
    marker1: room.marker1,
  });

  const dto = await multiplayerService.joinRoom(
    room.player2User,
    nextRoomCode,
    room.player1User,
    {
      boardSize: room.boardSize,
      marker1: room.marker1,
      marker2: room.marker2 || "O",
    },
  );

  const nextRoom = buildRoomState({
    roomCode: nextRoomCode,
    boardSize: room.boardSize,
    boardStyle: room.boardStyle,
    marker1: room.marker1,
    customBoardImage: room.customBoardImage,
    player1: room.player1,
    player1User: room.player1User,
    player2: room.player2,
    player2User: room.player2User,
    status: "active",
  });
  nextRoom.marker2 = room.marker2 || "O";
  nextRoom.sessionId = dto.session.id;

  leaveSocketRoom(io, oldRoomCode, room.player1);
  leaveSocketRoom(io, oldRoomCode, room.player2);
  io.sockets.sockets.get(room.player1)?.join(nextRoomCode);
  io.sockets.sockets.get(room.player2)?.join(nextRoomCode);

  rooms.delete(oldRoomCode);
  rooms.set(nextRoomCode, nextRoom);

  try {
    await multiplayerService.finishRoom(oldRoomCode);
  } catch (error) {
    console.error("Failed to finish previous rematch room:", error.message);
  }

  io.to(nextRoomCode).emit("rematchStarting", {
    roomCode: oldRoomCode,
    nextMatchConfig: {
      roomCode: nextRoomCode,
      boardSize: nextRoom.boardSize,
      boardStyle: nextRoom.boardStyle,
      customBoardImage: nextRoom.customBoardImage,
      marker1: nextRoom.marker1,
      marker2: nextRoom.marker2,
      player1SocketId: nextRoom.player1,
      player2SocketId: nextRoom.player2,
      player1Name: nextRoom.player1User.username,
      player2Name: nextRoom.player2User.username,
      player1AvatarURL: nextRoom.player1User.avatarURL || null,
      player2AvatarURL: nextRoom.player2User.avatarURL || null,
      sessionId: dto.session.id,
      backendSession: dto,
    },
  });

  broadcastRoomList(io);
}

function roomSocketHandler(io, socket) {
  socket.on("getRooms", () => {
    const openRooms = [...rooms.values()].filter((r) => r.status === "waiting");
    socket.emit("roomListUpdated", openRooms);
  });

  socket.on("createRoom", async ({ boardSize, boardStyle, marker1, customBoardImage }) => {
    const roomCode = uuidv4().slice(0, 6).toUpperCase();

    const existingRoom = [...rooms.values()].find(
      (r) => r.player1 === socket.id && r.status === "waiting",
    );

    if (existingRoom) {
      socket.emit("joinError", { message: "You are currently in a room" });
      return;
    }

    await multiplayerService.createRoom(socket.user, {
      roomCode,
      boardSize,
      boardStyle,
      marker1,
    });

    rooms.set(
      roomCode,
      buildRoomState({
        roomCode,
        boardSize,
        boardStyle,
        marker1,
        customBoardImage,
        player1: socket.id,
        player1User: socket.user,
      }),
    );

    socket.join(roomCode);
    socket.emit("waitingForOpponent", { roomCode });
    broadcastRoomList(io);
  });

  socket.on("joinRoom", async ({ roomCode }) => {
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);

    if (!room) {
      socket.emit("joinError", { message: "Room not found." });
      return;
    }
    if (room.player1 === socket.id) {
      socket.emit("joinError", { message: "You cannot join your own room." });
      return;
    }
    if (room.status !== "waiting") {
      socket.emit("joinError", { message: "Room is not available." });
      return;
    }
    if (room.player2) {
      socket.emit("joinError", { message: "Room is full." });
      return;
    }

    room.player2 = socket.id;
    room.player2User = socket.user;
    room.status = "active";
    socket.join(normalizedCode);

    io.to(normalizedCode).emit("waitForStart", {
      roomCode: normalizedCode,
      boardSize: room.boardSize,
      boardStyle: room.boardStyle,
      customBoardImage: room.customBoardImage,
      marker1: room.marker1,
      player1Name: room.player1User.username,
      player2Name: socket.user.username,
      player1AvatarURL: room.player1User.avatarURL || null,
      player2AvatarURL: socket.user.avatarURL || null,
      player2SocketId: socket.id,
    });

    broadcastRoomList(io);
  });

  socket.on("findMatch", async ({ boardSize, boardStyle, marker1, customBoardImage }) => {
    const availableRoom = [...rooms.values()].find(
      (r) => r.status === "waiting" && r.player1 !== socket.id,
    );

    if (availableRoom) {
      availableRoom.player2 = socket.id;
      availableRoom.player2User = socket.user;
      availableRoom.status = "active";
      socket.join(availableRoom.roomCode);

      io.to(availableRoom.roomCode).emit("waitForStart", {
        roomCode: availableRoom.roomCode,
        boardSize: availableRoom.boardSize,
        boardStyle: availableRoom.boardStyle,
        customBoardImage: availableRoom.customBoardImage,
        marker1: availableRoom.marker1,
        player1Name: availableRoom.player1User.username,
        player2Name: socket.user.username,
        player1AvatarURL: availableRoom.player1User.avatarURL || null,
        player2AvatarURL: socket.user.avatarURL || null,
        player2SocketId: socket.id,
      });

      broadcastRoomList(io);
      return;
    }

    const existingRoom = [...rooms.values()].find(
      (r) => r.player1 === socket.id && r.status === "waiting",
    );

    if (existingRoom) {
      socket.emit("joinError", { message: "You are currently in a room" });
      return;
    }

    const roomCode = uuidv4().slice(0, 6).toUpperCase();

    await multiplayerService.createRoom(socket.user, {
      roomCode,
      boardSize,
      boardStyle,
      marker1,
    });

    rooms.set(
      roomCode,
      buildRoomState({
        roomCode,
        boardSize,
        boardStyle,
        marker1,
        customBoardImage,
        player1: socket.id,
        player1User: socket.user,
      }),
    );

    socket.join(roomCode);
    socket.emit("waitingForOpponent", { roomCode });
    broadcastRoomList(io);
  });

  socket.on("startGame", async ({ roomCode, marker2 }) => {
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);
    if (!room) return;

    try {
      const dto = await multiplayerService.joinRoom(
        room.player2User,
        normalizedCode,
        room.player1User,
        { boardSize: room.boardSize, marker1: room.marker1, marker2 },
      );

      room.sessionId = dto.session.id;
      room.marker2 = marker2;
      room.status = "active";

      io.to(normalizedCode).emit("gameStart", {
        roomCode: normalizedCode,
        boardSize: room.boardSize,
        boardStyle: room.boardStyle,
        customBoardImage: room.customBoardImage,
        marker1: room.marker1,
        marker2,
        player1SocketId: room.player1,
        player2SocketId: room.player2,
        player1Name: room.player1User.username,
        player2Name: room.player2User.username,
        player1AvatarURL: room.player1User.avatarURL || null,
        player2AvatarURL: room.player2User.avatarURL || null,
        sessionId: dto.session.id,
        backendSession: dto,
      });

      broadcastRoomList(io);
    } catch (error) {
      console.error("Failed to start game:", error.message);
      io.to(normalizedCode).emit("joinError", { message: "Failed to start game." });
    }
  });

  socket.on("leaveOnlineMatch", async ({ roomCode, sessionId }) => {
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);

    if (!room || !isRoomPlayer(room, socket.id)) {
      socket.emit("roomLifecycleError", { message: "Online room not found." });
      return;
    }

    if (sessionId && room.sessionId && String(sessionId) !== String(room.sessionId)) {
      socket.emit("roomLifecycleError", { message: "Session does not match this room." });
      return;
    }

    await terminateActiveRoom(io, normalizedCode, room, socket.id, "player_left");
  });

  socket.on("createSpectatorLink", async ({ roomCode, sessionId }) => {
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);

    if (
      !room ||
      room.status !== "active" ||
      !room.sessionId ||
      String(room.sessionId) !== String(sessionId || "") ||
      !isRoomPlayer(room, socket.id)
    ) {
      socket.emit("spectatorLinkError", {
        message: "Unable to generate spectator link for this match.",
      });
      return;
    }

    try {
      const share =
        await multiplayerService.createOrGetSpectatorShareForActiveRoom(
          socket.user,
          room,
          sessionId,
        );
      socket.emit("spectatorLinkCreated", share);
    } catch {
      socket.emit("spectatorLinkError", {
        message: "Unable to generate spectator link for this match.",
      });
    }
  });

  socket.on("requestRematch", ({ roomCode, sessionId }) => {
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);

    if (!room || !isRoomPlayer(room, socket.id)) {
      socket.emit("roomLifecycleError", { message: "Online room not found." });
      return;
    }

    if (!["finished_waiting_decision", "rematch_pending"].includes(room.status)) {
      socket.emit("roomLifecycleError", { message: "This room is not ready for a rematch." });
      return;
    }

    if (
      sessionId &&
      room.lastFinishedSessionId &&
      String(sessionId) !== String(room.lastFinishedSessionId)
    ) {
      socket.emit("roomLifecycleError", { message: "Session does not match this room." });
      return;
    }

    if (room.status === "rematch_pending") {
      if (room.rematchRequestedBy === socket.id) {
        socket.emit("rematchWaitingForOpponent", {
          roomCode: normalizedCode,
          message: "Waiting for your opponent to respond.",
        });
        return;
      }

      startRematch(io, normalizedCode, room).catch((error) => {
        console.error("Failed to start rematch:", error.message);
        socket.emit("roomLifecycleError", { message: "Could not start rematch." });
      });
      return;
    }

    room.status = "rematch_pending";
    room.rematchRequestedBy = socket.id;
    startRoomDecisionTimer(io, normalizedCode, room);

    socket.emit("rematchWaitingForOpponent", {
      roomCode: normalizedCode,
      message: "Waiting for your opponent to respond.",
    });

    const opponentSocketId = getOpponentSocketId(room, socket.id);
    if (opponentSocketId) {
      io.to(opponentSocketId).emit("rematchRequested", {
        roomCode: normalizedCode,
        requestedBy: socket.id,
        requestedByName: socket.user?.username || "Opponent",
        message: "Your opponent wants to play again.",
      });
    }
  });

  socket.on("respondRematch", ({ roomCode, accept }) => {
    const normalizedCode = normalizeRoomCode(roomCode);
    const room = rooms.get(normalizedCode);

    if (!room || !isRoomPlayer(room, socket.id)) {
      socket.emit("roomLifecycleError", { message: "Online room not found." });
      return;
    }

    if (!accept) {
      closeRoomAfterPostMatch(io, normalizedCode, room, {
        reason: "opponent_declined",
        message: "Your opponent did not accept the rematch. This room has been closed.",
      });
      return;
    }

    if (room.status !== "rematch_pending" || !room.rematchRequestedBy) {
      socket.emit("roomLifecycleError", { message: "No rematch request is pending." });
      return;
    }

    if (room.rematchRequestedBy === socket.id) {
      socket.emit("rematchWaitingForOpponent", {
        roomCode: normalizedCode,
        message: "Waiting for your opponent to respond.",
      });
      return;
    }

    startRematch(io, normalizedCode, room).catch((error) => {
      console.error("Failed to start rematch:", error.message);
      socket.emit("roomLifecycleError", { message: "Could not start rematch." });
    });
  });

  socket.on("disconnect", async () => {
    for (const [code, room] of rooms) {
      if (!isRoomPlayer(room, socket.id)) continue;

      if (["finished_waiting_decision", "rematch_pending"].includes(room.status)) {
        await closeRoomAfterPostMatch(io, code, room, {
          reason: "opponent_left",
          message: "Your opponent left the room. This room has been closed.",
        });
        continue;
      }

      if (room.sessionId && room.status === "active") {
        await terminateActiveRoom(io, code, room, socket.id, "player_disconnected");
        continue;
      }

      clearRematchTimer(room);
      if (room.status === "waiting") {
        try {
          await multiplayerService.closeRoom(code);
        } catch (error) {
          console.error("Failed to close waiting room:", error.message);
        }
      }
      rooms.delete(code);
      broadcastRoomList(io);
    }
  });
}

roomSocketHandler.rooms = rooms;
roomSocketHandler.emitRoomClosed = emitRoomClosed;
roomSocketHandler.transitionRoomToFinishedDecision = transitionRoomToFinishedDecision;
module.exports = roomSocketHandler;
