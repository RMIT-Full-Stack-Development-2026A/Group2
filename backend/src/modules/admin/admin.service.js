const { createAuthInterface } = require("../auth/auth.interface");
const {
    createMultiplayerInterface,
} = require("../multiplayer/multiplayer.interface");
const {
    createGameInterface,
} = require("../game/domain/interfaces/game.interface");

const authInterface = createAuthInterface();
const multiplayerInterface = createMultiplayerInterface();
const gameInterface = createGameInterface();

async function getAllUsers() {
    return await authInterface.listUsersForAdmin();
}

async function toggleUserAccountStatus(userId) {
    return await authInterface.toggleUserAccountStatus(userId);
}

async function getSystemStats() {
    const users = await authInterface.listUsersForAdmin();
    const totalUsers = users.length;
    const activeUsers = users.filter(
        (user) => user.accountStatus === "active",
    ).length;
    const deactivatedUsers = totalUsers - activeUsers;
    return {
        totalUsers,
        activeUsers,
        deactivatedUsers,
    };
}

async function getAllLobbies() {
    const lobbies = await multiplayerInterface.listLobbiesForAdmin();

    const lobbiesWithUser = await Promise.all(
        lobbies.map(async (lobby) => {
            const sessionId = lobby.sessionId; // Extract session ID from lobby

            // If no session exists, get only the lobby owner
            if (sessionId) {
                const participantIds =
                    await gameInterface.listPlayersInLobby(sessionId); // Get participants ID in that session

                // Map participant ID into name
                const participantNames = await Promise.all(
                    participantIds.map(async (participantID) => {
                        const user =
                            await authInterface.findUserById(participantID);
                        return user.username;
                    }),
                );

                return {
                    roomNumber: lobby.roomNumber,
                    status: lobby.status,
                    startTime: lobby.startTime,
                    endTime: lobby.endTime,
                    players: participantNames,
                };
            } else {
                const ownerId = lobby.createdBy;
                const owner = await authInterface.findUserById(ownerId);

                return {
                    roomNumber: lobby.roomNumber,
                    status: lobby.status,
                    startTime: lobby.startTime,
                    endTime: lobby.endTime,
                    players: [owner.username],
                };
            }
        }),
    );

    return lobbiesWithUser;
}

async function closeLobby(roomId) {
    // Use multiplayer interface to modify room status on db

    // Emit socket event 
}

module.exports = {
    getAllUsers,
    toggleUserAccountStatus,
    getSystemStats,
    getAllLobbies,
};
