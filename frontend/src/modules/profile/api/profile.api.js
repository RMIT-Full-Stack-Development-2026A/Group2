import {
  httpGet,
  httpPatch,
  httpPatchFormData,
  httpPost,
} from "../../../lib/httpClient";
import { API_ENDPOINTS } from "../../../config/api.config";

/**
 * Raw GET for the authenticated user's profile (expects JSON body with `user`).
 */
export async function fetchProfileRequest() {
  return httpGet(API_ENDPOINTS.profile.me);
}

/**
 * PATCH profile (username, email, country). Uses same cookies + Bearer as other calls.
 * @param {{ username: string, email: string, country: string }} data
 */
export async function patchProfile(data) {
  return httpPatch(API_ENDPOINTS.profile.update, data);
}

/**
 * POST change-password (current + new + confirm). Separate from PATCH profile.
 * @param {{ currentPassword: string, newPassword: string, confirmNewPassword: string }} data
 */
export async function postChangePassword(data) {
  return httpPost(API_ENDPOINTS.profile.changePassword, data);
}

/**
 * PATCH profile logo (multipart/form-data with `logo` file field).
 * @param {FormData} formData
 */
export async function patchProfileLogo(formData) {
  return httpPatchFormData(API_ENDPOINTS.profile.uploadLogo, formData);
}

/**
 * GET match replay data for a specific session.
 */
export async function fetchMatchReplayRequest(sessionId) {
  return httpGet(API_ENDPOINTS.profile.replay(sessionId));
}

/**
 * GET match history for the authenticated player.
 */
export async function fetchMatchHistoryRequest(filters = {}) {
  const params = new URLSearchParams();
  const trimmedSearch = String(filters.search || "").trim();

  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  }

  if (filters.result) {
    params.set("result", filters.result);
  }

  if (filters.gameType) {
    params.set("gameType", filters.gameType);
  }

  if (filters.dateFrom) {
    params.set("dateFrom", filters.dateFrom);
  }

  if (filters.dateTo) {
    params.set("dateTo", filters.dateTo);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  const query = params.toString();
  const url = query
    ? `${API_ENDPOINTS.profile.history}?${query}`
    : API_ENDPOINTS.profile.history;
  return httpGet(url);
}
