const matchlobby = require("./model/matchLobby.model")

async function getAllLobbies() {
    const lobbies = await matchlobby.find({});
    return lobbies;
}

module.exports = {getAllLobbies}