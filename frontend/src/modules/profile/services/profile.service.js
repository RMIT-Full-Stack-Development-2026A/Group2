import {
  fetchProfileRequest,
  patchProfile,
  patchProfileLogo,
  postChangePassword,
} from "../api/profile.api";

function normalizeProfileUser(user) {
  if (!user || typeof user !== "object") {
    return null;
  }

  const profile = user.profile ?? {};
  const username = user.username ?? "";
  const displayName = user.displayName ?? profile.displayName ?? username;
  const email = profile.email ?? user.email ?? "";
  const country = profile.country ?? user.country ?? "";
  const avatarURL = profile.avatarURL ?? user.avatarURL ?? null;
  const profilePayload = {
    displayName,
    email,
    country,
    avatarURL,
    createdAt: profile.createdAt ?? null,
    updatedAt: profile.updatedAt ?? null,
  };

  return {
    id: user.id ?? user._id ?? null,
    username,
    displayName,
    email,
    country,
    avatarURL,
    role: user.role ?? "player",
    accountStatus: user.accountStatus ?? "active",
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
    profile: profilePayload,
  };
}

async function parseApiResponse(response, fallbackMessage) {
  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      code: typeof body.code === "string" ? body.code : undefined,
      message:
        typeof body.message === "string" && body.message.length
          ? body.message
          : fallbackMessage,
      errors: Array.isArray(body.errors) ? body.errors : [],
    };
  }

  return {
    ok: true,
    user: normalizeProfileUser(body.user),
    message: typeof body.message === "string" ? body.message : undefined,
  };
}

export async function getProfile() {
  const result = await getProfileResult();
  if (!result.ok) {
    return null;
  }
  return result.user;
}

export async function getProfileResult() {
  const response = await fetchProfileRequest();
  return parseApiResponse(response, "Could not load profile.");
}

/**
 * Update core profile fields. Parses JSON and normalizes API errors for forms.
 * @param {{ username: string, email: string, country: string }} data
 * @returns {Promise<
 *   | { ok: true; user: object; message?: string }
 *   | { ok: false; status: number; code?: string; message: string; errors: Array<{ field?: string; message?: string; example?: string }> }
 * >}
 */
export async function updateProfile(data) {
  const response = await patchProfile(data);
  return parseApiResponse(response, "Could not update profile.");
}

/**
 * @param {{ currentPassword: string, newPassword: string, confirmNewPassword: string }} data
 * @returns {Promise<
 *   | { ok: true; user: object; message?: string }
 *   | { ok: false; status: number; code?: string; message: string; errors: Array<{ field?: string; message?: string; example?: string }> }
 * >}
 */
export async function changePassword(data) {
  const response = await postChangePassword(data);
  return parseApiResponse(response, "Could not change password.");
}

/**
 * @param {File} file
 * @returns {Promise<
 *   | { ok: true; user: object; message?: string }
 *   | { ok: false; status: number; code?: string; message: string; errors: Array<{ field?: string; message?: string; example?: string }> }
 * >}
 */
export async function uploadProfileLogo(file) {
  const formData = new FormData();
  formData.append("logo", file);
  const response = await patchProfileLogo(formData);
  return parseApiResponse(response, "Could not upload logo.");
}
