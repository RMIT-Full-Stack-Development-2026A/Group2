const multiplayerRepo = require("./multiplayer.repository");

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

    return { listLobbiesForAdmin };
}

module.exports = { createMultiplayerInterface };
