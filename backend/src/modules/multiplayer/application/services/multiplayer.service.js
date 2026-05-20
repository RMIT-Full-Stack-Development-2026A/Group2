const crypto = require("crypto");
const AppError = require("../../../../shared/errors/AppError");
const multiplayerRepository = require("../../infrastructure/repositories/multiplayer.repository");
const { createGameInterface } = require("../../../game/domain/interfaces/game.interface");

const SPECTATOR_UNAVAILABLE_MESSAGE =
    "This spectator link is invalid or the match is no longer available.";
const gameInterface = createGameInterface();

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

    const dto = await gameInterface.createOnlineGame(player1User, player2User, {
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

async function finishRoom(roomCode) {
    const lobby = await multiplayerRepository.findLobbyByCode(roomCode);
    if (!lobby) return;
    await multiplayerRepository.finishLobby(lobby._id);
}

async function getWaitingRooms() {
    return multiplayerRepository.findWaitingLobbies();
}

function isRoomUser(socketUser, roomUser) {
    return Boolean(socketUser?.id && roomUser?.id && String(socketUser.id) === String(roomUser.id));
}

function getLiveRoomForLobby(lobby) {
    const roomSocketHandler = require("../../socket/roomSocketHandler");
    const roomCode = String(lobby?.lobbyCode || "").toUpperCase();
    return roomSocketHandler.rooms.get(roomCode) || null;
}

function throwSpectatorUnavailable() {
    throw new AppError(SPECTATOR_UNAVAILABLE_MESSAGE, {
        code: "SPECTATOR_LINK_UNAVAILABLE",
        statusCode: 404,
    });
}

async function createOrGetSpectatorShareForActiveRoom(socketUser, room, sessionId) {
    if (!room || room.status !== "active" || !room.sessionId) {
        throw new AppError("Unable to generate spectator link for this match.", {
            code: "SPECTATOR_SHARE_NOT_AVAILABLE",
            statusCode: 409,
        });
    }

    if (!sessionId || String(sessionId) !== String(room.sessionId)) {
        throw new AppError("Unable to generate spectator link for this match.", {
            code: "SPECTATOR_SESSION_MISMATCH",
            statusCode: 409,
        });
    }

    if (!isRoomUser(socketUser, room.player1User) && !isRoomUser(socketUser, room.player2User)) {
        throw new AppError("Unable to generate spectator link for this match.", {
            code: "SPECTATOR_SHARE_FORBIDDEN",
            statusCode: 403,
        });
    }

    const lobby = await multiplayerRepository.findLobbyBySessionId(sessionId);
    if (!lobby || lobby.status !== "active") {
        throw new AppError("Unable to generate spectator link for this match.", {
            code: "SPECTATOR_LOBBY_NOT_ACTIVE",
            statusCode: 409,
        });
    }

    if (lobby.spectatorShareToken && lobby.spectatorShareEnabled === true) {
        return {
            shareToken: lobby.spectatorShareToken,
            path: `/watch/${lobby.spectatorShareToken}`,
        };
    }

    const token = crypto.randomBytes(24).toString("hex");
    const updatedLobby = await multiplayerRepository.enableSpectatorShareForLobby(
        lobby._id,
        token,
    );

    return {
        shareToken: updatedLobby.spectatorShareToken,
        path: `/watch/${updatedLobby.spectatorShareToken}`,
    };
}

async function getSpectatorMatchSnapshotByToken(token) {
    const shareToken = String(token || "").trim();
    if (!shareToken) {
        throwSpectatorUnavailable();
    }

    const lobby = await multiplayerRepository.findLobbyBySpectatorShareToken(shareToken);
    if (
        !lobby ||
        lobby.spectatorShareEnabled !== true ||
        lobby.status !== "active" ||
        !lobby.sessionId
    ) {
        throwSpectatorUnavailable();
    }

    const room = getLiveRoomForLobby(lobby);
    if (
        !room ||
        room.status !== "active" ||
        !room.sessionId ||
        String(room.sessionId) !== String(lobby.sessionId)
    ) {
        throwSpectatorUnavailable();
    }

    const backendSession = await gameInterface.getSessionState(lobby.sessionId);
    if (backendSession?.session?.gameMode !== "online_match") {
        throwSpectatorUnavailable();
    }

    return {
        shareToken,
        roomCode: room.roomCode || lobby.lobbyCode,
        sessionId: String(lobby.sessionId),
        boardSize: room.boardSize || backendSession?.session?.boardSize || 10,
        boardStyle: room.boardStyle || "classic",
        customBoardImage: room.customBoardImage || null,
        marker1: room.marker1 || "X",
        marker2: room.marker2 || "O",
        player1Name: room.player1User?.username || "Player 1",
        player2Name: room.player2User?.username || "Player 2",
        player1AvatarURL: room.player1User?.avatarURL || null,
        player2AvatarURL: room.player2User?.avatarURL || null,
        backendSession,
    };
}

module.exports = {
    createRoom,
    joinRoom,
    closeRoom,
    finishRoom,
    getWaitingRooms,
    createOrGetSpectatorShareForActiveRoom,
    getSpectatorMatchSnapshotByToken,
};
