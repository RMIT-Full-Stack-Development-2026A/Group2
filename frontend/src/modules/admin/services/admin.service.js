import { httpGet } from "../../../lib/httpClient";
import { API_ENDPOINTS } from "../../../config/api.config";

// Call to backend to get all users for admin dashboard
export async function getAllUsers() {
    const response = await httpGet(API_ENDPOINTS.admin.getUsers);
    const data = await response.json();
    return data.users;
}

export async function toggleUserAccountStatus(userId) {
    const response = await httpGet(API_ENDPOINTS.admin.toggleUserStatus(userId));
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update account status.");
    }

    return data;
}

export async function getSystemStats() {
    const response = await httpGet(API_ENDPOINTS.admin.getStats);
    const data = await response.json();
    return data.stats;
}

export async function getAllLobbies() {
    const response = await httpGet(API_ENDPOINTS.admin.getOnlineLobbies);
    const data = await response.json();
    return data.lobbies;
}

export async function closeLobby(lobbyId) {
    const response = await httpGet(API_ENDPOINTS.admin.closeOnlineLobby(lobbyId));
    const data = await response.json();
    return data.lobby;
}
