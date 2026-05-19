const GameSession = require("../../model/gameSession.model");
const GameParticipant = require("../../model/gameParticipant.model");
const Move = require("../../model/move.model");
const MatchLobby = require("../../../multiplayer/model/matchLobby.model");

function normalizeUserId(userId) {
  if (userId == null) {
    return null;
  }

  if (typeof userId === "object" && typeof userId.toHexString === "function") {
    return userId.toHexString();
  }

  if (typeof userId === "object" && userId._id != null) {
    return normalizeUserId(userId._id);
  }

  if (userId && typeof userId === "object" && userId.id != null) {
    return String(userId.id);
  }

  return String(userId);
}

async function createSession(data) {
  return GameSession.create(data);
}

async function createParticipants(items) {
  return GameParticipant.insertMany(items);
}

async function findSessionById(id) {
  return GameSession.findById(id);
}

async function findSessionsByIds(ids) {
  return GameSession.find({ _id: { $in: ids } }).sort({ startTime: -1, _id: -1 });
}

async function findParticipantsBySession(sessionID) {
  return await GameParticipant.find({ sessionID }).sort({ turnOrder: 1, createdAt: 1 });
}

async function findParticipantsBySessionIds(sessionIds) {
  return GameParticipant.find({ sessionID: { $in: sessionIds } }).sort({
    sessionID: 1,
    turnOrder: 1,
    createdAt: 1,
  });
}

async function findParticipantsByUser(userId) {
  const normalizedUserId = normalizeUserId(userId);
  if (!normalizedUserId) {
    return [];
  }

  return GameParticipant.find({ userID: normalizedUserId }).sort({
    createdAt: -1,
    _id: -1,
  });
}

async function findParticipantBySessionAndUser(sessionID, userID) {
  const normalizedUserId = normalizeUserId(userID);
  if (!normalizedUserId) {
    return null;
  }

  return GameParticipant.findOne({ sessionID, userID: normalizedUserId });
}

async function findMovesBySession(sessionID) {
  return Move.find({ sessionID }).sort({ moveNumber: 1, playedAt: 1 });
}

async function findMoveByCell(sessionID, rowIndex, colIndex) {
  return Move.findOne({ sessionID, rowIndex, colIndex });
}

async function createMove(data) {
  return Move.create(data);
}

async function updateSession(id, updates) {
  return GameSession.findByIdAndUpdate(id, updates, { returnDocument: "after" });
}

async function updateParticipant(id, updates) {
  return GameParticipant.findByIdAndUpdate(id, updates, { returnDocument: "after" });
}

async function findLobbyBySessionId(sessionId) {
  return MatchLobby.findOne({ sessionId });
}

async function findLobbiesBySessionIds(sessionIds) {
  return MatchLobby.find({ sessionId: { $in: sessionIds } });
}

module.exports = {
  createSession,
  createParticipants,
  findSessionById,
  findSessionsByIds,
  findParticipantsBySession,
  findParticipantsBySessionIds,
  findParticipantsByUser,
  findParticipantBySessionAndUser,
  findMovesBySession,
  findMoveByCell,
  createMove,
  updateSession,
  updateParticipant,
  findLobbyBySessionId,
  findLobbiesBySessionIds,
};
