const jwt = require("jsonwebtoken");
const userRepository = require("../modules/auth/auth.repository");

function toAuthUserDto(userDoc) {
  if (!userDoc) return null;
  return {
    id: userDoc._id,
    username: userDoc.username,
    email: userDoc.email,
    role: userDoc.role,
    accountStatus: userDoc.accountStatus,
  };
}

async function validateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        code: "NO_TOKEN",
        message:
          "No access token was sent. Example: send Authorization: Bearer <your_jwt>.",
      });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json({
            status: "error",
            code: "INVALID_TOKEN",
            message:
              "Your session token is invalid or expired. Example: sign in again to get a new token.",
          });
        }

        const user = await userRepository.findById(decoded.id);

        if (!user) {
          return res.status(401).json({
            status: "error",
            code: "USER_NOT_FOUND",
            message:
              "No user matches this token. Example: register a new account or sign in again.",
          });
        }

        if (user.accountStatus !== "active") {
          return res.status(403).json({
            status: "error",
            code: "ACCOUNT_INACTIVE",
            message:
              "This account is deactivated. Example: contact an administrator to restore access.",
          });
        }

        req.user = toAuthUserDto(user);
        next();
      },
    );
  } catch (err) {
    return res.status(401).json({
      status: "error",
      code: "AUTH_ERROR",
      message: "Authentication failed.",
    });
  }
}

module.exports = validateToken;
