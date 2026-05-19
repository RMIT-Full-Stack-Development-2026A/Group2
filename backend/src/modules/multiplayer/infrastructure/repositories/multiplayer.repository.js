const MatchLobby = require("../../model/matchLobby.model");

async function createLobby(data) {
    return MatchLobby.create(data);
}

async function findLobbyByCode(lobbyCode) {
    return MatchLobby.findOne({ lobbyCode });
}

async function findLobbyBySessionId(sessionId) {
    return MatchLobby.findOne({ sessionId });
}

async function findLobbyBySpectatorToken(token) {
    return MatchLobby.findOne({ spectatorShareToken: token });
}

async function findWaitingLobbies() {
    return MatchLobby.find({ status: "waiting" });
}

async function updateLobby(id, updates) {
    return MatchLobby.findByIdAndUpdate(id, updates, { returnDocument: "after" });
}

async function enableSpectatorShareBySessionId(sessionId, token) {
    return MatchLobby.findOneAndUpdate(
        { sessionId },
        {
            spectatorShareToken: token,
            spectatorShareEnabled: true,
            spectatorShareCreatedAt: new Date(),
        },
        { returnDocument: "after" }
    );
}

async function closeLobby(id) {
    return MatchLobby.findByIdAndUpdate(
        id,
        { status: "closed", endedAt: new Date() },
        { returnDocument: "after" }
    );
}

async function getAllLobbies() {
    const lobbies = await MatchLobby.find({});
    return lobbies;
}

module.exports = {
    createLobby,
    findLobbyByCode,
    findLobbyBySessionId,
    findLobbyBySpectatorToken,
    findWaitingLobbies,
    updateLobby,
    enableSpectatorShareBySessionId,
    closeLobby,
    getAllLobbies
};
