const multiplayerService = require("../../application/services/multiplayer.service");
const AppError = require("../../../../shared/errors/AppError");
const { sendError } = require("../../../../shared/utils/httpResponse");

function handleControllerError(res, err) {
    if (err instanceof AppError) {
        return sendError(res, err.statusCode, err.code, err.message, err.errors);
    }

    return sendError(
        res,
        err.statusCode || 500,
        err.code || "INTERNAL_ERROR",
        err.message || "Something went wrong.",
        err.errors,
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

async function createSpectatorShareLink(req, res) {
    try {
        const share = await multiplayerService.createOrGetSpectatorShareLink(
            req.user,
            req.body?.sessionId,
        );

        return res.status(200).json({
            status: "success",
            share,
        });
    } catch (err) {
        return handleControllerError(res, err);
    }
}

async function getSpectatorMatch(req, res) {
    try {
        const spectatorMatch = await multiplayerService.getSpectatorMatchSnapshotByToken(
            req.params.token,
        );

        return res.status(200).json({
            status: "success",
            spectatorMatch,
        });
    } catch (err) {
        return handleControllerError(res, err);
    }
}

module.exports = {
    getWaitingRooms,
    createSpectatorShareLink,
    getSpectatorMatch,
};
