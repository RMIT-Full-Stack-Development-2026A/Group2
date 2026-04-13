import {
  fetchProfileRequest,
  patchProfile,
  postChangePassword,
} from "../api/profile.api";

export async function getProfile() {
  const response = await fetchProfileRequest();
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.user ?? null;
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
  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok) {
    const errors = Array.isArray(body.errors) ? body.errors : [];
    return {
      ok: false,
      status: response.status,
      code: typeof body.code === "string" ? body.code : undefined,
      message:
        typeof body.message === "string" && body.message.length
          ? body.message
          : "Could not update profile.",
      errors,
    };
  }

  return {
    ok: true,
    user: body.user ?? null,
    message: typeof body.message === "string" ? body.message : undefined,
  };
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
  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok) {
    const errors = Array.isArray(body.errors) ? body.errors : [];
    return {
      ok: false,
      status: response.status,
      code: typeof body.code === "string" ? body.code : undefined,
      message:
        typeof body.message === "string" && body.message.length
          ? body.message
          : "Could not change password.",
      errors,
    };
  }

  return {
    ok: true,
    user: body.user ?? null,
    message: typeof body.message === "string" ? body.message : undefined,
  };
}
