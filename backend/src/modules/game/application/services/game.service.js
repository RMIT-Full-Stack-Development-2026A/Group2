const AppError = require("../../../../shared/errors/AppError");
const gameRepository = require("../../infrastructure/repositories/game.repository");
const { buildBoard, getEmptyCells } = require("../../utils/board.utils");
const { getWinningLine } = require("../../utils/winChecker");
const { chooseEasyAiMove } = require("../../ai/easy-ai");
const { chooseMediumAiMove } = require("../../ai/medium-ai");
const { chooseHardAiMove } = require("../../ai/hard-ai");

function getParticipantToken(participant) {
  return participant.turnOrder === 1 ? "P1" : "P2";
}

function toGameStateDto(session, participants, moves, board) {
  return {
    session: {
      id: String(session._id),
      gameMode: session.gameMode,
      status: session.status,
      result: session.result,
      boardSize: session.boardSize,
      aiDifficulty: session.aiDifficulty,
      startTime: session.startTime,
      endTime: session.endTime,
      currentTurn: session.currentTurn ? String(session.currentTurn) : null,
      winnerParticipantID: session.winnerParticipantID
        ? String(session.winnerParticipantID)
        : null,
      winningLine: session.winningLine ?? [],
    },
    participants: participants.map((p) => ({
      id: String(p._id),
      displayName: p.displayName,
      participantType: p.participantType,
      turnOrder: p.turnOrder,
      isWinner: p.isWinner,
      userID: p.userID ? String(p.userID) : null,
    })),
    moves: moves.map((m) => ({
      id: String(m._id),
      moveNumber: m.moveNumber,
      participantID: String(m.participantID),
      rowIndex: m.rowIndex,
      colIndex: m.colIndex,
      playedAt: m.playedAt,
    })),
    board,
  };
}

function ensurePlayerUser(authUser) {
  if (!authUser?.id) {
    throw new AppError("Authenticated player is required.", {
      code: "UNAUTHENTICATED",
      statusCode: 401,
    });
  }
}

async function loadGameState(sessionId) {
  const session = await gameRepository.findSessionById(sessionId);
  if (!session) {
    throw new AppError("Game session not found.", {
      code: "GAME_NOT_FOUND",
      statusCode: 404,
    });
  }

  const participants = await gameRepository.findParticipantsBySession(sessionId);
  const moves = await gameRepository.findMovesBySession(sessionId);

  const participantMap = {};
  for (const participant of participants) {
    participantMap[String(participant._id)] = participant;
  }

  const board = buildBoard(session.boardSize, moves, participantMap);

  return { session, participants, moves, board, participantMap };
}

function resolveAiName(aiDifficulty) {
  if (aiDifficulty === "easy") return "CPU Easy";
  if (aiDifficulty === "medium") return "CPU Medium";
  return "CPU Hard";
}

async function createLocalGame(authUser, payload) {
  ensurePlayerUser(authUser);

  const {
    player2Name,
    boardSize = 10,
    firstTurn = 1,
  } = payload;

  const session = await gameRepository.createSession({
    gameMode: "two_player",
    status: "ongoing",
    result: "pending",
    boardSize,
    currentTurn: null,
    winnerParticipantID: null,
    winningLine: [],
    aiDifficulty: null,
  });

  const participants = await gameRepository.createParticipants([
    {
      sessionID: session._id,
      userID: authUser.id,
      participantType: "player",
      isWinner: false,
      displayName: authUser.username || "Player 1",
      marker: "P1",
      turnOrder: 1,
    },
    {
      sessionID: session._id,
      userID: null,
      participantType: "guest",
      isWinner: false,
      displayName: String(player2Name).trim(),
      marker: "P2",
      turnOrder: 2,
    },
  ]);

  const currentTurnParticipant =
    firstTurn === 1
      ? participants.find((p) => p.turnOrder === 1)
      : participants.find((p) => p.turnOrder === 2);

  const updatedSession = await gameRepository.updateSession(session._id, {
    currentTurn: currentTurnParticipant._id,
  });

  return toGameStateDto(updatedSession, participants, [], buildBoard(boardSize, [], {}));
}

async function createSinglePlayerGame(authUser, payload) {
  ensurePlayerUser(authUser);

  const {
    boardSize = 10,
    aiDifficulty = "easy",
    firstTurn = 1,
  } = payload;

  const session = await gameRepository.createSession({
    gameMode: "single_player",
    status: "ongoing",
    result: "pending",
    boardSize,
    currentTurn: null,
    winnerParticipantID: null,
    winningLine: [],
    aiDifficulty,
  });

  const participants = await gameRepository.createParticipants([
    {
      sessionID: session._id,
      userID: authUser.id,
      participantType: "player",
      isWinner: false,
      displayName: authUser.username || "Player 1",
      marker: "P1",
      turnOrder: 1,
    },
    {
      sessionID: session._id,
      userID: null,
      participantType: "ai",
      isWinner: false,
      displayName: resolveAiName(aiDifficulty),
      marker: "P2",
      turnOrder: 2,
    },
  ]);

  const currentTurnParticipant =
    firstTurn === 1
      ? participants.find((p) => p.turnOrder === 1)
      : participants.find((p) => p.turnOrder === 2);

  await gameRepository.updateSession(session._id, {
    currentTurn: currentTurnParticipant._id,
  });

  if (firstTurn === 2) {
    await makeAiMove(session._id);
    return getSessionState(session._id);
  }

  return getSessionState(session._id);
}

async function createOnlineGame(player1User, player2User, payload) {
  const { boardSize = 10, marker1 = "P1", marker2 = "P2" } = payload;

  const session = await gameRepository.createSession({
    gameMode: "online_match",
    status: "ongoing",
    result: "pending",
    boardSize,
    currentTurn: null,
    winnerParticipantID: null,
    winningLine: [],
    aiDifficulty: null
  });

  const participants = await gameRepository.createParticipants([
    {
      sessionID: session._id,
      userID: player1User.id,
      participantType: "player",
      isWinner: false,
      displayName: player1User.username || "Player 1",
      marker: marker1,
      turnOrder: 1
    },
    {
      sessionID: session._id,
      userID: player2User.id,
      participantType: "player",
      isWinner: false,
      displayName: player2User.username || "Player 2",
      marker: marker2,
      turnOrder: 2
    },
  ]);

  const updatedSession = await gameRepository.updateSession(session._id, {
    currentTurn: participants[0]._id
  });

  return toGameStateDto(updatedSession, participants, [], buildBoard(boardSize, [], {}));
}

async function finishGame(session, winnerParticipant, refreshedMoves, refreshedBoard) {
  await gameRepository.updateParticipant(winnerParticipant._id, {
    isWinner: true,
  });

  const winningLine = getWinningLine(
    refreshedBoard,
    refreshedMoves[refreshedMoves.length - 1].rowIndex,
    refreshedMoves[refreshedMoves.length - 1].colIndex,
    getParticipantToken(winnerParticipant),
  );

  const updatedSession = await gameRepository.updateSession(session._id, {
    status: "finished",
    result: winnerParticipant.turnOrder === 1 ? "player1_win" : "player2_win",
    endTime: new Date(),
    winnerParticipantID: winnerParticipant._id,
    winningLine: winningLine || [],
    currentTurn: null,
  });

  const finalParticipants = await gameRepository.findParticipantsBySession(session._id);
  return toGameStateDto(updatedSession, finalParticipants, refreshedMoves, refreshedBoard);
}

async function makeAiMove(sessionId) {
  const { session, participants, moves, board } = await loadGameState(sessionId);

  if (session.gameMode !== "single_player") return null;
  if (session.status !== "ongoing") return null;

  const aiParticipant = participants.find((p) => p.participantType === "ai");
  const humanParticipant = participants.find((p) => p.participantType === "player");

  if (!aiParticipant || !humanParticipant) return null;
  if (String(session.currentTurn) !== String(aiParticipant._id)) return null;

  const lastHumanMove = [...moves]
    .reverse()
    .find((m) => String(m.participantID) === String(humanParticipant._id));

  const humanToken = getParticipantToken(humanParticipant);
  const aiToken = getParticipantToken(aiParticipant);

  let aiMove = null;

  if (session.aiDifficulty === "easy") {
    aiMove = chooseEasyAiMove(board, lastHumanMove || null);
  } else if (session.aiDifficulty === "medium") {
    aiMove = chooseMediumAiMove(board, humanToken, lastHumanMove || null);
  } else {
    aiMove = chooseHardAiMove(board, aiToken, humanToken, lastHumanMove || null);
  }

  if (!aiMove) return null;

  await gameRepository.createMove({
    sessionID: session._id,
    participantID: aiParticipant._id,
    moveNumber: moves.length + 1,
    rowIndex: aiMove.rowIndex,
    colIndex: aiMove.colIndex,
  });

  const refreshedMoves = await gameRepository.findMovesBySession(sessionId);
  const refreshedParticipants = await gameRepository.findParticipantsBySession(sessionId);

  const participantMap = {};
  for (const participant of refreshedParticipants) {
    participantMap[String(participant._id)] = participant;
  }

  const refreshedBoard = buildBoard(session.boardSize, refreshedMoves, participantMap);

  const aiWin = getWinningLine(
    refreshedBoard,
    aiMove.rowIndex,
    aiMove.colIndex,
    aiToken,
  );

  if (aiWin) {
    return finishGame(session, aiParticipant, refreshedMoves, refreshedBoard);
  }

  if (!getEmptyCells(refreshedBoard).length) {
    const updatedSession = await gameRepository.updateSession(session._id, {
      status: "finished",
      result: "draw",
      endTime: new Date(),
      currentTurn: null,
      winnerParticipantID: null,
      winningLine: [],
    });

    return toGameStateDto(updatedSession, refreshedParticipants, refreshedMoves, refreshedBoard);
  }

  const updatedSession = await gameRepository.updateSession(session._id, {
    currentTurn: humanParticipant._id,
  });

  return toGameStateDto(updatedSession, refreshedParticipants, refreshedMoves, refreshedBoard);
}

async function makeMove(authUser, sessionId, payload) {
  ensurePlayerUser(authUser);

  const { rowIndex, colIndex } = payload;
  const { session, participants, moves, board, participantMap } = await loadGameState(sessionId);

  if (!["ongoing", "waiting"].includes(session.status)) {
    throw new AppError("This game is not accepting new moves.", {
      code: "GAME_NOT_ACTIVE",
      statusCode: 409,
    });
  }

  const authenticatedParticipants = participants.filter(
    (p) => p.userID && String(p.userID) === String(authUser.id),
  );

  let requestingParticipant = null;

  if (authenticatedParticipants.length === 1) {
    requestingParticipant = authenticatedParticipants[0];
  } else if (authenticatedParticipants.length > 1) {
    requestingParticipant =
      authenticatedParticipants.find(
        (p) => String(p._id) === String(session.currentTurn),
      ) || authenticatedParticipants[0];
  }

  // Local two-player uses a guest P2 without userID. Allow the authenticated
  // local player account to play that side when it is the guest's turn.
  if (session.gameMode === "two_player") {
    const ownerParticipant = authenticatedParticipants[0] || null;
    const currentTurnParticipant = participants.find(
      (p) => String(p._id) === String(session.currentTurn),
    );

    if (
      ownerParticipant &&
      currentTurnParticipant &&
      !currentTurnParticipant.userID &&
      currentTurnParticipant.participantType === "guest"
    ) {
      requestingParticipant = currentTurnParticipant;
    }
  }

  if (!requestingParticipant) {
    throw new AppError("You are not a participant in this game.", {
      code: "NOT_GAME_PARTICIPANT",
      statusCode: 403,
    });
  }

  if (String(session.currentTurn) !== String(requestingParticipant._id)) {
    throw new AppError("It is not your turn.", {
      code: "NOT_YOUR_TURN",
      statusCode: 409,
    });
  }

  if (
    rowIndex < 0 ||
    rowIndex >= session.boardSize ||
    colIndex < 0 ||
    colIndex >= session.boardSize
  ) {
    throw new AppError("Move is out of board range.", {
      code: "MOVE_OUT_OF_RANGE",
      statusCode: 400,
      errors: [
        {
          field: "position",
          message: `rowIndex and colIndex must be between 0 and ${session.boardSize - 1}.`,
          example: "Example: rowIndex 0, colIndex 0",
        },
      ],
    });
  }

  if (board[rowIndex][colIndex] !== null) {
    throw new AppError("That cell is already occupied.", {
      code: "CELL_OCCUPIED",
      statusCode: 409,
    });
  }

  await gameRepository.createMove({
    sessionID: session._id,
    participantID: requestingParticipant._id,
    moveNumber: moves.length + 1,
    rowIndex,
    colIndex,
  });

  const refreshedMoves = await gameRepository.findMovesBySession(sessionId);
  const refreshedBoard = buildBoard(session.boardSize, refreshedMoves, participantMap);

  const playerToken = getParticipantToken(requestingParticipant);
  const winningLine = getWinningLine(
    refreshedBoard,
    rowIndex,
    colIndex,
    playerToken,
  );

  if (winningLine) {
    return finishGame(session, requestingParticipant, refreshedMoves, refreshedBoard);
  }

  if (!getEmptyCells(refreshedBoard).length) {
    const updatedSession = await gameRepository.updateSession(session._id, {
      status: "finished",
      result: "draw",
      endTime: new Date(),
      currentTurn: null,
      winnerParticipantID: null,
      winningLine: [],
    });

    const finalParticipants = await gameRepository.findParticipantsBySession(sessionId);
    return toGameStateDto(updatedSession, finalParticipants, refreshedMoves, refreshedBoard);
  }

  const nextParticipant = participants.find(
    (p) => String(p._id) !== String(requestingParticipant._id),
  );

  await gameRepository.updateSession(session._id, {
    status: "ongoing",
    currentTurn: nextParticipant ? nextParticipant._id : null,
  });

  if (session.gameMode === "single_player" && nextParticipant?.participantType === "ai") {
    await makeAiMove(session._id);
    return getSessionState(session._id);
  }

  return getSessionState(session._id);
}

async function abortGame(authUser, sessionId) {
  ensurePlayerUser(authUser);

  const { session, participants, moves, board } = await loadGameState(sessionId);

  if (["finished", "aborted"].includes(session.status)) {
    throw new AppError("This game has already ended.", {
      code: "GAME_ALREADY_ENDED",
      statusCode: 409,
    });
  }

  const requestingParticipant = participants.find(
    (p) => String(p.userID) === String(authUser.id),
  );

  if (!requestingParticipant) {
    throw new AppError("You are not a participant in this game.", {
      code: "NOT_GAME_PARTICIPANT",
      statusCode: 403,
    });
  }

  const updatedSession = await gameRepository.updateSession(session._id, {
    status: "aborted",
    result: "aborted",
    endTime: new Date(),
    currentTurn: null,
    winnerParticipantID: null,
    winningLine: [],
  });

  return toGameStateDto(updatedSession, participants, moves, board);
}

async function getSessionState(sessionId) {
  const { session, participants, moves, board } = await loadGameState(sessionId);
  return toGameStateDto(session, participants, moves, board);
}

module.exports = {
  createLocalGame,
  createSinglePlayerGame,
  createOnlineGame,
  makeMove,
  abortGame,
  getSessionState,
};