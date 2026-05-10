import { httpGet, httpPatch, httpPatchFormData, httpPost } from "../../../lib/httpClient";

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

/**
 * PATCH profile logo (multipart/form-data with `logo` file field).
 * @param {FormData} formData
 */
export async function patchProfileLogo(formData) {
  return httpPatchFormData("/api/profile/logo", formData);
}

/**
 * GET match history for the authenticated player.
 */
export async function fetchMatchHistoryRequest(search = "") {
  const params = new URLSearchParams();
  const trimmedSearch = String(search || "").trim();

  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  }

  const query = params.toString();
  const url = query ? `/api/profile/history?${query}` : "/api/profile/history";
  return httpGet(url);
}
