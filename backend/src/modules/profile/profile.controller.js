const AppError = require("../../shared/errors/AppError");
const { sendError } = require("../../shared/utils/httpResponse");
const profileService = require("./profile.service");

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

function getAuthenticatedUserId(req) {
  const userId = req?.user?.id;
  if (!userId) {
    throw new AppError("Unauthorized.", {
      code: "UNAUTHORIZED",
      statusCode: 401,
    });
  }
  return String(userId);
}

async function getProfile(req, res) {
  try {
    const user = await profileService.getProfile(getAuthenticatedUserId(req));
    return res.json({ status: "success", user });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function updateProfile(req, res) {
  try {
    const user = await profileService.updateProfile(
      getAuthenticatedUserId(req),
      req.body,
    );
    return res.json({ status: "success", user });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function changePassword(req, res) {
  try {
    const user = await profileService.changePassword(
      getAuthenticatedUserId(req),
      req.body,
    );
    return res.json({ status: "success", user });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function getMatchHistory(req, res) {
  try {
    const history = await profileService.getMatchHistory(
      getAuthenticatedUserId(req),
      req.query ?? {},
    );
    return res.json({ status: "success", history });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function getMatchReplay(req, res) {
  try {
    const replay = await profileService.getMatchReplay(
      getAuthenticatedUserId(req),
      req.params.sessionId,
    );
    return res.json({ status: "success", replay });
  } catch (err) {
    return handleControllerError(res, err);
  }
}

async function uploadProfileLogo(req, res) {
  try {
    const user = await profileService.uploadProfileLogo(
      String(req.user.id),
      req.file,
    );
    res.json({
      status: "success",
      message: "Logo uploaded successfully.",
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
  uploadProfileLogo,
  getMatchHistory,
  getMatchReplay,
};