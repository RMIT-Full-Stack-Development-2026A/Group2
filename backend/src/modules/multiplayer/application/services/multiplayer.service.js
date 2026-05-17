const multiplayerRepository = require("../../infrastructure/repositories/multiplayer.repository");
const gameService = require("../../../game/application/services/game.service");

async function createRoom(user, { roomCode, boardSize, boardStyle, marker1, marker2 }) {
    const lobby = await multiplayerRepository.createLobby({
        lobbyCode: roomCode,
        createdBy: user.id,
        status: "waiting",
    });
    return lobby;
}

async function joinRoom(player2User, roomCode, player1User, { boardSize, marker1, marker2 }) {
    const lobby = await multiplayerRepository.findLobbyByCode(roomCode);
    if (!lobby) throw new Error("Room not found.");

    const dto = await gameService.createOnlineGame(player1User, player2User, {
        boardSize,
        marker1,
        marker2,
    });

    await multiplayerRepository.updateLobby(lobby._id, {
        sessionId: dto.session.id,
        status: "active",
        startedAt: new Date(),
    });

    return dto;
}

async function closeRoom(roomCode) {
    const lobby = await multiplayerRepository.findLobbyByCode(roomCode);
    if (!lobby) return;
    await multiplayerRepository.closeLobby(lobby._id);
}

async function getWaitingRooms() {
    return multiplayerRepository.findWaitingLobbies();
}

module.exports = {
    createRoom,
    joinRoom,
    closeRoom,
    getWaitingRooms
};