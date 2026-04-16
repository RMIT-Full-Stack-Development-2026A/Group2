const authService = require("./auth.service");
const AppError = require("../../shared/errors/AppError");
const { sendError } = require("../../shared/utils/httpResponse");
const { validateLoginBody } = require("./auth.validation");
const {
  assertNotLocked,
  recordFailedLogin,
  clearLoginAttempts,
} = require("../../middleware/loginAttemptLimiter");

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
  if (err.statusCode === 429 && err.code) {
    return sendError(res, 429, err.code, err.message);
  }
  return sendError(
    res,
    500,
    "INTERNAL_ERROR",
    "Something went wrong. Please try again later.",
  );
}

async function signUp(req, res) {
  try {
    const { username, displayName, email, password, confirmPassword, country } =
      req.body;

    const user = await authService.signUp(
      username,
      displayName,
      email,
      password,
      confirmPassword,
      country,
    );

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    handleControllerError(res, err);
  }
}

async function logIn(req, res) {
  const { identifier, password } = req.body;

  const validationErrors = validateLoginBody({ identifier, password });
  if (validationErrors.length) {
    return sendError(
      res,
      400,
      "VALIDATION_ERROR",
      "Validation failed.",
      validationErrors,
    );
  }

  const trimmedId = identifier.trim();

  try {
    assertNotLocked(req, trimmedId);

    const { accessToken, refreshToken, user } = await authService.logIn(
      trimmedId,
      password,
    );

    clearLoginAttempts(req, trimmedId);

    const secureCookie = process.env.NODE_ENV === "production";
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: secureCookie,
      sameSite: secureCookie ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(200).json({
      status: "success",
      accessToken,
      user,
    });
  } catch (err) {
    if (err instanceof AppError && err.failedLoginAttempt) {
      recordFailedLogin(req, trimmedId);
    }
    handleControllerError(res, err);
  }
}

function logOut(req, res) {
  const cookies = req.cookies;

  const secureCookie = process.env.NODE_ENV === "production";
  if (cookies?.jwt) {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: secureCookie,
      sameSite: secureCookie ? "none" : "lax",
      path: "/",
    });
  }

  res.json({
    status: "success",
    message: "Logged out successfully",
  });
}

async function refresh(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return sendError(
      res,
      401,
      "NO_REFRESH_TOKEN",
      "No refresh session cookie found. Example: sign in again from the login page.",
    );
  }

  try {
    const { accessToken, user } = await authService.refresh(cookies.jwt);
    res.json({
      status: "success",
      accessToken,
      user,
    });
  } catch (err) {
    handleControllerError(res, err);
  }
}

module.exports = {
  signUp,
  logIn,
  logOut,
  refresh,
};
