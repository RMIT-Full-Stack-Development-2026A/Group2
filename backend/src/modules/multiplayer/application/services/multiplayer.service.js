const crypto = require("crypto");
const AppError = require("../../../../shared/errors/AppError");
const multiplayerRepository = require("../../infrastructure/repositories/multiplayer.repository");
const gameService = require("../../../game/application/services/game.service");
const gameRepository = require("../../../game/infrastructure/repositories/game.repository");

function ensureAuthUser(authUser) {
    if (!authUser?.id) {
        throw new AppError("Authenticated player is required.", {
            code: "UNAUTHENTICATED",
            statusCode: 401,
        });
    }
}

function ensureToken(token) {
    if (!String(token || "").trim()) {
        throw new AppError("Spectator token is required.", {
            code: "SPECTATOR_TOKEN_REQUIRED",
            statusCode: 400,
        });
    }
}

function createShareToken() {
    return crypto.randomBytes(32).toString("hex");
}

function sanitizeSpectatorBackendSession(dto) {
    return {
        ...dto,
        participants: (dto.participants || []).map((participant) => ({
            id: participant.id,
            displayName: participant.displayName,
            participantType: participant.participantType,
            turnOrder: participant.turnOrder,
            isWinner: participant.isWinner,
        })),
    };
}

function buildSpectatorMatchDto(lobby, backendSession) {
    const participants = backendSession.participants || [];
    const player1 = participants.find((participant) => participant.turnOrder === 1);
    const player2 = participants.find((participant) => participant.turnOrder === 2);

    return {
        shareToken: lobby.spectatorShareToken,
        roomCode: lobby.lobbyCode,
        sessionId: String(lobby.sessionId),
        gameType: "online",
        boardSize: lobby.boardSize || backendSession.session?.boardSize || 10,
        boardStyle: lobby.boardStyle || "classic",
        customBoardImage: lobby.customBoardImage || null,
        marker1: lobby.marker1 || player1?.marker || "X",
        marker2: lobby.marker2 || player2?.marker || "O",
        player1Name: player1?.displayName || "Player 1",
        player2Name: player2?.displayName || "Player 2",
        backendSession: sanitizeSpectatorBackendSession(backendSession),
    };
}

async function createRoom(user, { roomCode, boardSize, boardStyle, marker1, marker2, customBoardImage }) {
    const lobby = await multiplayerRepository.createLobby({
        lobbyCode: roomCode,
        createdBy: user.id,
        status: "waiting",
        boardSize,
        boardStyle,
        customBoardImage: customBoardImage || null,
        marker1,
        marker2: marker2 || "O",
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
        boardSize,
        marker1,
        marker2,
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

async function createOrGetSpectatorShareLink(authUser, sessionId) {
    ensureAuthUser(authUser);

    if (!String(sessionId || "").trim()) {
        throw new AppError("Session id is required.", {
            code: "VALIDATION_ERROR",
            statusCode: 400,
            errors: [
                {
                    field: "sessionId",
                    message: "sessionId is required.",
                    example: "Example: { \"sessionId\": \"65f...\" }",
                },
            ],
        });
    }

    const lobby = await multiplayerRepository.findLobbyBySessionId(sessionId);
    if (!lobby) {
        throw new AppError("Lobby not found.", {
            code: "LOBBY_NOT_FOUND",
            statusCode: 404,
        });
    }

    const backendSession = await gameService.getSessionState(sessionId);
    if (backendSession.session.gameMode !== "online_match") {
        throw new AppError("Spectator sharing is only available for online matches.", {
            code: "NOT_ONLINE_MATCH",
            statusCode: 400,
        });
    }

    if (backendSession.session.status !== "ongoing") {
        throw new AppError("Spectator sharing is only available while the match is active.", {
            code: "MATCH_NOT_ACTIVE",
            statusCode: 409,
        });
    }

    const participant = await gameRepository.findParticipantBySessionAndUser(sessionId, authUser.id);
    if (!participant) {
        throw new AppError("You are not a participant in this match.", {
            code: "NOT_GAME_PARTICIPANT",
            statusCode: 403,
        });
    }

    if (lobby.spectatorShareEnabled && lobby.spectatorShareToken) {
        return {
            shareToken: lobby.spectatorShareToken,
            path: `/watch/${lobby.spectatorShareToken}`,
        };
    }

    let updatedLobby = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
        const token = createShareToken();

        try {
            updatedLobby = await multiplayerRepository.enableSpectatorShareBySessionId(
                sessionId,
                token,
            );
            break;
        } catch (error) {
            if (error?.code !== 11000 || attempt === 2) {
                throw error;
            }
        }
    }

    if (!updatedLobby?.spectatorShareToken) {
        throw new AppError("Could not create spectator share link.", {
            code: "SPECTATOR_SHARE_FAILED",
            statusCode: 500,
        });
    }

    return {
        shareToken: updatedLobby.spectatorShareToken,
        path: `/watch/${updatedLobby.spectatorShareToken}`,
    };
}

async function getSpectatorMatchSnapshotByToken(token) {
    ensureToken(token);

    const lobby = await multiplayerRepository.findLobbyBySpectatorToken(token);
    if (!lobby || !lobby.spectatorShareEnabled || !lobby.sessionId) {
        throw new AppError("This spectator link is invalid or no longer available.", {
            code: "SPECTATOR_LINK_UNAVAILABLE",
            statusCode: 404,
        });
    }

    const backendSession = await gameService.getSessionState(lobby.sessionId);
    if (backendSession.session.gameMode !== "online_match") {
        throw new AppError("This spectator link is invalid or no longer available.", {
            code: "SPECTATOR_LINK_UNAVAILABLE",
            statusCode: 404,
        });
    }

    return buildSpectatorMatchDto(lobby, backendSession);
}

async function getSpectatorWatchTarget(token) {
    const spectatorMatch = await getSpectatorMatchSnapshotByToken(token);
    return {
        roomCode: spectatorMatch.roomCode,
        sessionId: spectatorMatch.sessionId,
    };
}

module.exports = {
    createRoom,
    joinRoom,
    closeRoom,
    getWaitingRooms,
    createOrGetSpectatorShareLink,
    getSpectatorMatchSnapshotByToken,
    getSpectatorWatchTarget,
};
