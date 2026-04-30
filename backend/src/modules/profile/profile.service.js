const bcrypt = require("bcrypt");
const AppError = require("../../shared/errors/AppError");
const profileRepository = require("./profile.repository");
const authRepository = require("../auth/auth.repository");
const {
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
} = require("../../shared/utils/upload.utils");

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
  const payload = body ?? {};
  const { newPassword } = payload;

  const errors = validateChangePasswordBody(payload);
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

const ALLOWED_LOGO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

async function uploadProfileLogo(userId, file) {
  if (!file) {
    throw new AppError("Logo file is required.", {
      code: "LOGO_REQUIRED",
      statusCode: 400,
    });
  }

  if (!ALLOWED_LOGO_MIME_TYPES.has(file.mimetype)) {
    throw new AppError("Logo must be a JPG, JPEG, PNG, or WEBP image.", {
      code: "INVALID_LOGO_TYPE",
      statusCode: 400,
    });
  }

  const user = await authRepository.findById(userId);
  if (!user) {
    throw new AppError("User not found.", {
      code: "USER_NOT_FOUND",
      statusCode: 404,
    });
  }

  const existingProfile = await profileRepository.findByUserId(userId);
  if (!existingProfile) {
    throw new AppError("Profile not found.", {
      code: "PROFILE_NOT_FOUND",
      statusCode: 404,
    });
  }

  let uploaded;
  try {
    uploaded = await uploadBufferToCloudinary(file.buffer, {
      folder: "player-logos",
      resource_type: "image",
      transformation: [
        {
          width: 256,
          height: 256,
          crop: "fill",
          gravity: "auto",
        },
        {
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    });
  } catch (_error) {
    throw new AppError("Could not upload logo to image storage.", {
      code: "LOGO_UPLOAD_FAILED",
      statusCode: 502,
    });
  }

  await profileRepository.updateByUserId(userId, {
    avatarURL: uploaded.secure_url,
    avatarPublicId: uploaded.public_id,
  });

  if (existingProfile.avatarPublicId && existingProfile.avatarPublicId !== uploaded.public_id) {
    await destroyCloudinaryAsset(existingProfile.avatarPublicId);
  }

  const updated = await authRepository.findById(userId);
  return profileResponseDto(updated);
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileLogo,
  profileResponseDto,
};
