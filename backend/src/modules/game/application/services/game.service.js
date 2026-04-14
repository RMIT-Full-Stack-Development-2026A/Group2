const AppError = require("../../../../shared/errors/AppError");
const gameRepository = require("../../infrastructure/repositories/game.repository");
const { buildBoard } = require("../../utils/board.utils");
const { getWinningLine } = require("../../utils/winChecker");

function toGameStateDto(session, participants, moves, board) {
  return {
    session: {
      id: String(session._id),
      gameMode: session.gameMode,
      status: session.status,
      result: session.result,
      boardSize: session.boardSize,
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
      marker: p.marker,
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

async function createLocalGame(authUser, payload) {
  ensurePlayerUser(authUser);

  const {
    player2Name,
    boardSize = 10,
    player1Marker = "X",
    player2Marker = "O",
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
  });

  const participants = await gameRepository.createParticipants([
    {
      sessionID: session._id,
      userID: authUser.id,
      participantType: "player",
      isWinner: false,
      displayName: authUser.username || "Player 1",
      marker: player1Marker,
      turnOrder: 1,
    },
    {
      sessionID: session._id,
      userID: null,
      participantType: "guest",
      isWinner: false,
      displayName: String(player2Name).trim(),
      marker: player2Marker,
      turnOrder: 2,
    },
  ]);

  const player1 = participants.find((p) => p.turnOrder === 1);
  const player2 = participants.find((p) => p.turnOrder === 2);

  const currentTurnParticipant = firstTurn === 1 ? player1 : player2;

  const updatedSession = await gameRepository.updateSession(session._id, {
    currentTurn: currentTurnParticipant._id,
  });

  return toGameStateDto(updatedSession, participants, [], buildBoard(boardSize, [], {}));
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

  const requestingParticipant = participants.find(
    (p) => String(p.userID) === String(authUser.id),
  );

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

  const nextMoveNumber = moves.length + 1;

  await gameRepository.createMove({
    sessionID: session._id,
    participantID: requestingParticipant._id,
    moveNumber: nextMoveNumber,
    rowIndex,
    colIndex,
  });

  const refreshedMoves = await gameRepository.findMovesBySession(sessionId);
  const refreshedBoard = buildBoard(session.boardSize, refreshedMoves, participantMap);

  const winningLine = getWinningLine(
    refreshedBoard,
    rowIndex,
    colIndex,
    requestingParticipant.marker,
  );

  let updatedSession;

  if (winningLine) {
    await gameRepository.updateParticipant(requestingParticipant._id, {
      isWinner: true,
    });

    updatedSession = await gameRepository.updateSession(session._id, {
      status: "finished",
      result: requestingParticipant.turnOrder === 1 ? "player1_win" : "player2_win",
      endTime: new Date(),
      winnerParticipantID: requestingParticipant._id,
      winningLine,
      currentTurn: null,
    });
  } else {
    const nextParticipant = participants.find(
      (p) => String(p._id) !== String(requestingParticipant._id),
    );

    updatedSession = await gameRepository.updateSession(session._id, {
      status: "ongoing",
      currentTurn: nextParticipant ? nextParticipant._id : null,
    });
  }

  const finalParticipants = await gameRepository.findParticipantsBySession(sessionId);
  return toGameStateDto(updatedSession, finalParticipants, refreshedMoves, refreshedBoard);
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
  makeMove,
  abortGame,
  getSessionState,
};