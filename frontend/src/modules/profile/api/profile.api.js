import { httpGet, httpPatch, httpPost } from "../../../lib/httpClient";

/**
 * Raw GET for the authenticated user's profile (expects JSON body with `user`).
 */
export async function fetchProfileRequest() {
  return httpGet("/api/profile");
}

/**
 * PATCH profile (username, email, country). Uses same cookies + Bearer as other calls.
 * @param {{ username: string, email: string, country: string }} data
 */
export async function patchProfile(data) {
  return httpPatch("/api/profile", data);
}

/**
 * POST change-password (current + new + confirm). Separate from PATCH profile.
 * @param {{ currentPassword: string, newPassword: string, confirmNewPassword: string }} data
 */
export async function postChangePassword(data) {
  return httpPost("/api/profile/change-password", data);
}
