import { fetchProfileRequest } from "../api/profile.api";

export async function getProfile() {
  const response = await fetchProfileRequest();
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  return data.user ?? null;
}
