import { API_ENDPOINTS, apiRequest } from "../../../config/api.config";
import { parseApiErrorPayload } from "../utils/auth.validation";

// Attach field errors to the Error for bullet UI.
function throwHttpError(data, response) {
    if (data?.errors?.length) {
        const err = new Error("Please review the issues below and try again.");
        err.validationErrors = data.errors;
        throw err;
    }
    throw new Error(parseApiErrorPayload(data, response));
}

function toResponseLike(error) {
    return {
        status: error?.status ?? 0,
        statusText: "",
    };
}

function handleApiError(error) {
    if (error?.validationErrors?.length) {
        throw error;
    }

    throwHttpError(error?.data, toResponseLike(error));
}

async function authRequest(endpoint, options = {}) {
    try {
        return await apiRequest(endpoint, {
            credentials: "include",
            ...options,
        });
    } catch (error) {
        handleApiError(error);
    }
}

export async function registerUser(payload) {
    return authRequest(API_ENDPOINTS.auth.register, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function loginUser(payload) {
    return authRequest(API_ENDPOINTS.auth.login, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export async function logoutUser() {
    return authRequest(API_ENDPOINTS.auth.logout, {
        method: "POST",
    });
}

export async function refreshToken() {
    return authRequest(API_ENDPOINTS.auth.refresh, {
        method: "POST",
    });
}
