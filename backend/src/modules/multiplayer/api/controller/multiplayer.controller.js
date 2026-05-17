const multiplayerService = require("../../application/services/multiplayer.service");

async function getWaitingRooms(req, res, next) {
    try {
        const rooms = await multiplayerService.getWaitingRooms();
        res.status(200).json({ data: rooms });
    } catch (error) {
        next(error);
    }
}

module.exports = { getWaitingRooms };