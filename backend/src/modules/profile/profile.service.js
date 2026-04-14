const bcrypt = require("bcrypt");
const AppError = require("../../shared/utils/AppError");
const profileRepository = require("./profile.repository");
const authRepository = require("../auth/auth.repository");
const {
  validateProfileUpdateBody,
  validateChangePasswordBody,
} = require("./profile.validation");

function throwValidation(errors) {
  throw new AppError("Validation failed.", {
    code: "VALIDATION_ERROR",
    statusCode: 400,
    errors,
  });
}

function profileResponseDto(authUserDoc) {
  if (!authUserDoc) {
    return null;
  }
  return {
    id: authUserDoc._id,
    username: authUserDoc.username,
    role: authUserDoc.role,
    accountStatus: authUserDoc.accountStatus,
    createdAt: authUserDoc.createdAt ? authUserDoc.createdAt.toISOString() : null,
    updatedAt: authUserDoc.updatedAt ? authUserDoc.updatedAt.toISOString() : null,
    profile: {
      displayName: authUserDoc.displayName ?? authUserDoc.username,
      email: authUserDoc.email,
      country: authUserDoc.country,
      avatarURL: authUserDoc.avatarURL ?? null,
      createdAt: authUserDoc.profileCreatedAt
        ? authUserDoc.profileCreatedAt.toISOString()
        : null,
      updatedAt: authUserDoc.profileUpdatedAt
        ? authUserDoc.profileUpdatedAt.toISOString()
        : null,
    },
  };
}

async function getProfile(userId) {
  const user = await authRepository.findById(userId);
  if (!user) {
    throw new AppError("User not found.", {
      code: "USER_NOT_FOUND",
      statusCode: 404,
    });
  }
  return profileResponseDto(user);
}

async function updateProfile(userId, body) {
  const errors = validateProfileUpdateBody(body);
  if (errors.length) {
    throwValidation(errors);
  }

  const trimmedUsername = body.username.trim();
  const trimmedDisplayName = body.displayName.trim();
  const trimmedEmail = body.email.trim().toLowerCase();
  const avatarURL =
    body.avatarURL === undefined ? undefined : body.avatarURL?.trim() || null;

  const existing = await authRepository.findById(userId);
  if (!existing) {
    throw new AppError("User not found.", {
      code: "USER_NOT_FOUND",
      statusCode: 404,
    });
  }

  try {
    await authRepository.updateUser(userId, { username: trimmedUsername });
    await profileRepository.updateByUserId(userId, {
      displayName: trimmedDisplayName,
      email: trimmedEmail,
      country: body.country,
      ...(avatarURL !== undefined ? { avatarURL } : {}),
    });
    const updated = await authRepository.findById(userId);
    return profileResponseDto(updated);
  } catch (e) {
    if (e?.code === 11000) {
      const key = Object.keys(e.keyPattern ?? e.keyValue ?? {})[0];
      if (key === "username") {
        throw new AppError("Username already taken.", {
          code: "USERNAME_IN_USE",
          statusCode: 409,
        });
      }
      if (key === "email") {
        throw new AppError("Email already in use.", {
          code: "EMAIL_IN_USE",
          statusCode: 409,
        });
      }
    }
    throw e;
  }
}

async function changePassword(userId, body) {
  const errors = validateChangePasswordBody(body);
  if (errors.length) {
    throwValidation(errors);
  }

  const { currentPassword, newPassword } = body;
  const user = await authRepository.findByIdWithPasswordHash(userId);
  if (!user?.passwordHash) {
    throw new AppError("User not found.", {
      code: "USER_NOT_FOUND",
      statusCode: 404,
    });
  }

  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) {
    throw new AppError("Current password is incorrect.", {
      code: "INVALID_CURRENT_PASSWORD",
      statusCode: 401,
    });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  const updated = await authRepository.updateUser(userId, { passwordHash });
  if (!updated) {
    throw new AppError("User not found.", {
      code: "USER_NOT_FOUND",
      statusCode: 404,
    });
  }

  return profileResponseDto(updated);
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  profileResponseDto,
};
