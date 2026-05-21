const multiplayerRepo = require("../../infrastructure/repositories/multiplayer.repository")

/**
 * @typedef {Object} RoomConfig
 * @property {string} roomCode
 * @property {number} boardSize
 * @property {string} boardStyle
 * @property {string} marker1
 * @property {string} marker2
 * @property {string} player1SocketId
 * @property {string} player2SocketId
 * @property {string} player1Name
 * @property {string} player2Name
 * @property {string | null} player1AvatarURL
 * @property {string | null} player2AvatarURL
 * @property {string} sessionId
 */

/**
 * @typedef {Object} LobbyDto
 * @property {string} id
 * @property {string} lobbyCode
 * @property {string} status
 * @property {string} createdBy
 * @property {Date} startedAt
 * @property {Date} endedAt
 */

function toExternaLobbyDto(lobbyData) {
    return {
        id: String(lobbyData._id),
        roomNumber: lobbyData.lobbyCode,
        sessionId: lobbyData.sessionId,
        status: lobbyData.status,
        startTime: lobbyData.startedAt,
        endTime: lobbyData.endedAt,
        createdBy: lobbyData.createdBy,
    };
}

function createMultiplayerInterface() {
    async function listLobbiesForAdmin() {
        const lobbies = await multiplayerRepo.getAllLobbies();
        return lobbies.map(toExternaLobbyDto);
    }

    async function closeLobbyForAdmin(lobbyId) {
        const lobby = await multiplayerRepo.closeLobby(lobbyId);
        return toExternaLobbyDto(lobby);
    }

    return { listLobbiesForAdmin, closeLobbyForAdmin };
}

module.exports = { createMultiplayerInterface };
