const multiplayerService = require("../../application/services/multiplayer.service");
const AppError = require("../../../../shared/errors/AppError");
const { sendError } = require("../../../../shared/utils/httpResponse");

function handleControllerError(res, err) {
    if (err instanceof AppError) {
        return sendError(res, err.statusCode, err.code, err.message, err.errors);
    }

    return sendError(
        res,
        500,
        "INTERNAL_ERROR",
        "Something went wrong. Please try again later.",
    );
}

async function getWaitingRooms(req, res, next) {
    try {
        const rooms = await multiplayerService.getWaitingRooms();
        res.status(200).json({ data: rooms });
    } catch (error) {
        next(error);
    }
}

async function getSpectatorMatch(req, res) {
    try {
        const spectatorMatch =
            await multiplayerService.getSpectatorMatchSnapshotByToken(
                req.params.token,
            );
        return res.json({ status: "success", spectatorMatch });
    } catch (error) {
        return handleControllerError(res, error);
    }
}

module.exports = { getWaitingRooms, getSpectatorMatch };
