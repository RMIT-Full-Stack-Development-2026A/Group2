const profileService = require("./profile.service");
const AppError = require("../../shared/utils/AppError");
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

async function getProfile(req, res) {
  try {
    const user = await profileService.getProfile(String(req.user.id));
    res.json({ status: "success", user });
  } catch (err) {
    handleControllerError(res, err);
  }
}

async function updateProfile(req, res) {
  try {
    const user = await profileService.updateProfile(String(req.user.id), req.body);
    res.json({
      status: "success",
      message: "Profile updated successfully.",
      user,
    });
  } catch (err) {
    handleControllerError(res, err);
  }
}

async function changePassword(req, res) {
  try {
    const user = await profileService.changePassword(String(req.user.id), req.body);
    res.json({
      status: "success",
      message: "Password changed successfully.",
      user,
    });
  } catch (err) {
    handleControllerError(res, err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
