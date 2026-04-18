const bcrypt = require("bcrypt");
const AppError = require("../../shared/errors/AppError");
const profileRepository = require("./profile.repository");
const authRepository = require("../auth/auth.repository");
const { createGameInterface } = require("../game/domain/interfaces/game.interface");
const { createPremiumInterface } = require("../premium/premium.interface");
const {
  validateProfileUpdateBody,
  validateChangePasswordBody,
} = require("./profile.validation");

const gameInterface = createGameInterface();
const premiumInterface = createPremiumInterface();

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
  const payload = body ?? {};
  const { currentPassword, newPassword } = payload;

  // Require current password first, then verify it before other password validations.
  if (typeof currentPassword !== "string" || !currentPassword.length) {
    const errors = validateChangePasswordBody(payload).filter(
      (error) => error.field === "currentPassword",
    );
    throwValidation(errors);
  }

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

  const errors = validateChangePasswordBody(payload).filter(
    (error) => error.field !== "currentPassword",
  );
  if (errors.length) {
    throwValidation(errors);
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

async function getMatchHistory(userId, filters = {}) {
  const items = await gameInterface.listHistoryForUser(userId, filters);
  const isPremium = await premiumInterface.hasActiveSubscription(userId);

  return {
    items: items.map((item) => ({
      ...item,
      canReplay: isPremium,
    })),
    isPremium,
  };
}

async function getMatchReplay(userId, sessionId) {
  const isPremium = await premiumInterface.hasActiveSubscription(userId);

  if (!isPremium) {
    throw new AppError("Replay is available for premium players only.", {
      code: "PREMIUM_REQUIRED",
      statusCode: 403,
    });
  }

  return gameInterface.getReplayForUser(userId, sessionId);
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  getMatchHistory,
  getMatchReplay,
  profileResponseDto,
};
