import { httpGet } from "../../../lib/httpClient";

// Call to backend to get all users for admin dashboard
export async function getAllUsers() {
    const response = await httpGet("/api/admin/users");
    const data = await response.json();
    return data.users;
}

export async function toggleUserAccountStatus(userId) {
    const response = await httpGet(`/api/admin/users/change-status/${userId}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update account status.");
    }

    return data;
}

export async function getSystemStats() {
    const response = await httpGet("/api/admin/stats");
    const data = await response.json();
    return data.stats;
}

export async function getAllLobbies() {
    const response = await httpGet("/api/admin/online-lobbies");
    const data = await response.json();
    return data.lobbies;
}
