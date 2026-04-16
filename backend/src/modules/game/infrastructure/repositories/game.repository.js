const GameSession = require("../../model/gameSession.model");
const GameParticipant = require("../../model/gameParticipant.model");
const Move = require("../../model/move.model");

async function createSession(data) {
  return GameSession.create(data);
}

async function createParticipants(items) {
  return GameParticipant.insertMany(items);
}

async function findSessionById(id) {
  return GameSession.findById(id);
}

async function findParticipantsBySession(sessionID) {
  return GameParticipant.find({ sessionID }).sort({ turnOrder: 1, createdAt: 1 });
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
  return GameSession.findByIdAndUpdate(id, updates, { new: true });
}

async function updateParticipant(id, updates) {
  return GameParticipant.findByIdAndUpdate(id, updates, { new: true });
}

module.exports = {
  createSession,
  createParticipants,
  findSessionById,
  findParticipantsBySession,
  findMovesBySession,
  findMoveByCell,
  createMove,
  updateSession,
  updateParticipant,
};