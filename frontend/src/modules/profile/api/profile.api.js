import { httpGet } from "../../../lib/httpClient";

/**
 * Raw GET for the authenticated user's profile (expects JSON body with `user`).
 */
export async function fetchProfileRequest() {
  return httpGet("/api/auth/profile");
}
