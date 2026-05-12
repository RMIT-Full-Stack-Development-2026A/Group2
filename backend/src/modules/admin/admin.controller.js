const adminService = require("./admin.service");
const { sendError } = require("../../shared/utils/httpResponse");

function handleControllerError(res, err) {
    if (err instanceof AppError) {
        return sendError(
            res,
            err.statusCode,
            err.code,
            err.message,
            err.errors,
        );
    }

    return sendError(
        res,
        500,
        "INTERNAL_ERROR",
        "Something went wrong. Please try again later.",
    );
}

async function getAllUsers(req, res) {
    try {
        const users = await adminService.getAllUsers();

        return res.status(200).json({
            status: "success",
            users,
        });
    } catch (err) {
        return handleControllerError(res, err);
    }
}

async function toggleUserAccountStatus(req, res) {
    try {
        const userId = req.params.userId;
        const user = await adminService.toggleUserAccountStatus(userId);

        return res.status(200).json({
            status: "success",
            message: "Account status updated successfully",
            user,
        });
    } catch (err) {
        return handleControllerError(res, err);
    }
}

async function getSystemStats(req, res) {
    try {
        const stats = await adminService.getSystemStats();

        return res.status(200).json({
            status: "success",
            stats,
        });
    } catch (err) {
        return handleControllerError(res, err);
    }
}

async function getAllLobbies(req, res) {
    try {
        const lobbies = await adminService.getAllLobbies();

        return res.status(200).json({
            status: "success",
            lobbies,
        });
    } catch (err) {
        return handleControllerError(res, err);
    }
}

async function closeLobby(req, res) {
    try {
        const roomId = req.params.roomId;
        const lobby = await adminService.closeLobby(roomId);

        return res.status(200).json({
            status: "success",
            lobby,
        });
    } catch (err) {
        return handleControllerError(res, err);
    }
}

module.exports = {
    getAllUsers,
    toggleUserAccountStatus,
    getSystemStats,
    getAllLobbies,
    closeLobby,
};
