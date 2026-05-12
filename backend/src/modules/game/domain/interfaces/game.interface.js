const AppError = require("../../../../shared/errors/AppError");
const gameRepository = require("../../infrastructure/repositories/game.repository");

function normalizeGameType(gameMode) {
  if (gameMode === "single_player") return "ai";
  if (gameMode === "two_player") return "local";
  if (gameMode === "online_match") return "online";
  return gameMode;
}

function mapReplayGameType(gameMode) {
  if (gameMode === "single_player") return "Single Player";
  if (gameMode === "two_player") return "Two Player";
  if (gameMode === "online_match") return "Online Match";
  return gameMode;
}

function parseDateOrNull(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseDateToEndOfDayOrNull(value) {
  const date = parseDateOrNull(value);
  if (!date) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
    date.setHours(23, 59, 59, 999);
  }

  return date;
}

function toSessionMap(items) {
  const map = new Map();
  for (const item of items) {
    map.set(String(item._id), item);
  }
  return map;
}

function toGroupedParticipants(items) {
  const grouped = new Map();
  for (const item of items) {
    const key = String(item.sessionID);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  }
  return grouped;
}

function toLobbyMap(items) {
  const map = new Map();
  for (const item of items) {
    map.set(String(item.sessionId), item);
  }
  return map;
}

function buildHistoryResult(session, meParticipant) {
  if (session.result === "aborted") return "aborted";
  if (session.result === "draw") return "draw";
  if (!session.winnerParticipantID) return "unknown";

  return String(session.winnerParticipantID) === String(meParticipant._id)
    ? "win"
    : "lose";
}

function getOpponentParticipant(participants, meParticipant) {
  return (
    participants.find((participant) => String(participant._id) !== String(meParticipant._id)) ||
    null
  );
}

function matchesSearch(historyRow, rawSearch) {
  const term = String(rawSearch || "").trim().toLowerCase();
  if (!term) return true;

  const haystacks = [
    historyRow.sessionId,
    historyRow.sessionNumber,
    historyRow.roomCode,
    historyRow.opponentName,
    historyRow.opponentType,
    historyRow.aiDifficulty,
    historyRow.gameType,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return haystacks.some((value) => value.includes(term));
}

function matchesResult(historyRow, result) {
  if (!result) return true;
  const normalizedRowResult = String(historyRow.result || "aborted").toLowerCase();
  const normalizedFilter = String(result).toLowerCase();

  if (normalizedFilter === "aborted") {
    return normalizedRowResult === "aborted" || normalizedRowResult === "unknown";
  }

  return normalizedRowResult === normalizedFilter;
}

function matchesGameType(historyRow, gameType) {
  if (!gameType) return true;
  return String(historyRow.gameType).toLowerCase() === String(gameType).toLowerCase();
}

function matchesDateRange(historyRow, dateFrom, dateTo) {
  const startedAt = parseDateOrNull(historyRow.startTime);
  if (!startedAt) return true;

  if (dateFrom) {
    const from = parseDateOrNull(dateFrom);
    if (from && startedAt < from) return false;
  }

  if (dateTo) {
    const to = parseDateToEndOfDayOrNull(dateTo);
    if (to && startedAt > to) return false;
  }

  return true;
}

function sortHistoryRows(items, sort) {
  const direction = String(sort || "desc").toLowerCase() === "asc" ? 1 : -1;

  return [...items].sort((a, b) => {
    const aTime = parseDateOrNull(a.startTime)?.getTime() ?? 0;
    const bTime = parseDateOrNull(b.startTime)?.getTime() ?? 0;

    if (aTime !== bTime) {
      return (aTime - bTime) * direction;
    }

    return String(a.sessionId).localeCompare(String(b.sessionId)) * direction;
  });
}

function toReplayParticipantDto(participant) {
  return {
    id: String(participant._id),
    displayName: participant.displayName,
    participantType: participant.participantType,
    turnOrder: participant.turnOrder,
    isWinner: participant.isWinner,
    userID: participant.userID ? String(participant.userID) : null,
    marker: participant.marker,
  };
}

function toReplayMoveDto(move) {
  return {
    id: String(move._id),
    moveNumber: move.moveNumber,
    participantID: String(move.participantID),
    rowIndex: move.rowIndex,
    colIndex: move.colIndex,
    playedAt: move.playedAt,
  };
}

function createGameInterface() {
  async function listHistoryForUser(userId, filters = {}) {
    const myParticipants = await gameRepository.findParticipantsByUser(userId);

    if (!myParticipants.length) {
      return { items: [], totalCount: 0 };
    }

    const sessionIds = [...new Set(myParticipants.map((item) => String(item.sessionID)))];
    const [sessions, allParticipants, lobbies] = await Promise.all([
      gameRepository.findSessionsByIds(sessionIds),
      gameRepository.findParticipantsBySessionIds(sessionIds),
      gameRepository.findLobbiesBySessionIds(sessionIds),
    ]);

    const sessionMap = toSessionMap(sessions);
    const participantsBySession = toGroupedParticipants(allParticipants);
    const lobbyMap = toLobbyMap(lobbies);

    const historyRows = [];

    for (const myParticipant of myParticipants) {
      const sessionId = String(myParticipant.sessionID);
      const session = sessionMap.get(sessionId);
      if (!session) continue;

      const participants = participantsBySession.get(sessionId) || [];
      const opponent = getOpponentParticipant(participants, myParticipant);
      const lobby = lobbyMap.get(sessionId) || null;
      const result = buildHistoryResult(session, myParticipant);

      historyRows.push({
        sessionId,
        sessionNumber: `#${sessionId.slice(-4).toUpperCase()}`,
        roomCode: lobby?.lobbyCode || null,
        gameType: normalizeGameType(session.gameMode),
        gameTypeLabel: mapReplayGameType(session.gameMode),
        boardSize: session.boardSize,
        result,
        startTime: session.startTime,
        endTime: session.endTime,
        status: session.status,
        opponentName: opponent?.displayName || "Unknown Opponent",
        opponentType: opponent?.participantType || "unknown",
        aiDifficulty: session.aiDifficulty || null,
      });
    }

    const filtered = historyRows.filter((item) => {
      return (
        matchesSearch(item, filters.search) &&
        matchesResult(item, filters.result) &&
        matchesGameType(item, filters.gameType) &&
        matchesDateRange(item, filters.dateFrom, filters.dateTo)
      );
    });

    return {
      items: sortHistoryRows(filtered, filters.sort),
      totalCount: historyRows.length,
    };
  }

  async function getReplayForUser(userId, sessionId) {
    const [session, myParticipant] = await Promise.all([
      gameRepository.findSessionById(sessionId),
      gameRepository.findParticipantBySessionAndUser(sessionId, userId),
    ]);

    if (!session) {
      throw new AppError("Game session not found.", {
        code: "GAME_NOT_FOUND",
        statusCode: 404,
      });
    }

    if (!myParticipant) {
      throw new AppError("You are not allowed to access this replay.", {
        code: "NOT_GAME_PARTICIPANT",
        statusCode: 403,
      });
    }

    const [participants, moves, lobby] = await Promise.all([
      gameRepository.findParticipantsBySession(sessionId),
      gameRepository.findMovesBySession(sessionId),
      gameRepository.findLobbyBySessionId(sessionId),
    ]);

    return {
      session: {
        id: String(session._id),
        gameMode: session.gameMode,
        gameType: normalizeGameType(session.gameMode),
        gameTypeLabel: mapReplayGameType(session.gameMode),
        status: session.status,
        result: session.result,
        boardSize: session.boardSize,
        aiDifficulty: session.aiDifficulty,
        startTime: session.startTime,
        endTime: session.endTime,
        winnerParticipantID: session.winnerParticipantID
          ? String(session.winnerParticipantID)
          : null,
        winningLine: session.winningLine ?? [],
        roomCode: lobby?.lobbyCode || null,
      },
      participants: participants.map(toReplayParticipantDto),
      moves: moves.map(toReplayMoveDto),
    };
  }

  return {
    listHistoryForUser,
    getReplayForUser,
  };
}

module.exports = {
  createGameInterface,
};
