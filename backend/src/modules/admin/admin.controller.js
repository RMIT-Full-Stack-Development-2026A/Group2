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

module.exports = {
    getAllUsers,
    toggleUserAccountStatus,
};
