import { parseApiErrorPayload } from "../utils/auth.validation";

// Auth API URL. Dev uses /api/... (Vite proxy to backend).
function resolveAuthBase() {
    const explicit = import.meta.env.VITE_API_AUTH_BASE?.replace(/\/$/, "");
    if (explicit) {
        return explicit;
    }
    if (import.meta.env.DEV) {
        return "/api/auth";
    }
    return "/api/auth";
}

const API_BASE_URL = resolveAuthBase();

// Extra detail when fetch fails (not only "Failed to fetch").
function networkErrorMessage(url, err) {
    const msg = err?.message ?? "";
    const isNetwork =
        err?.name === "TypeError" &&
        (msg === "Failed to fetch" ||
            msg.includes("NetworkError") ||
            msg.includes("Load failed"));

    if (!isNetwork) {
        return msg || "Request failed.";
    }

    const devHint =
        import.meta.env.DEV &&
        " In dev, requests go through Vite to your backend—set VITE_PROXY_API_TARGET in frontend/.env if the API is not on http://localhost:3000.";

    return [
        `Could not reach the API at ${url}.`,
        "Is the backend running? Check that its PORT matches VITE_PROXY_API_TARGET (default proxy: localhost:3000).",
        devHint ||
            " For production, set VITE_API_AUTH_BASE to your public API URL.",
    ]
        .filter(Boolean)
        .join(" ");
}

// Read body as text first; parse JSON when possible.
async function parseResponseBody(response) {
    const text = await response.text();
    if (!text.trim()) {
        return {};
    }
    try {
        return JSON.parse(text);
    } catch {
        return { _nonJson: true, _textPreview: text.slice(0, 280) };
    }
}

async function authFetch(path, init) {
    const url = `${API_BASE_URL}${path}`;
    try {
        return await fetch(url, init);
    } catch (err) {
        throw new Error(networkErrorMessage(url, err));
    }
}

// Attach field errors to the Error for bullet UI.
function throwHttpError(data, response) {
    if (data?.errors?.length) {
        const err = new Error("Please review the issues below and try again.");
        err.validationErrors = data.errors;
        throw err;
    }
    throw new Error(parseApiErrorPayload(data, response));
}

export async function registerUser(payload) {
    const response = await authFetch("/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
        throwHttpError(data, response);
    }

    return data;
}

export async function loginUser(payload) {
    const response = await authFetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
        throwHttpError(data, response);
    }

    return data;
}

export async function logoutUser() {
    const response = await authFetch("/logout", {
        method: "POST",
        credentials: "include",
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
        throwHttpError(data, response);
    }

    return data;
}

export async function refreshToken() {
    const response = await authFetch("/refresh", {
        method: "POST",
        credentials: "include",
    });

    const data = await parseResponseBody(response);

    if (!response.ok) {
        throwHttpError(data, response);
    }

    return data;
}
