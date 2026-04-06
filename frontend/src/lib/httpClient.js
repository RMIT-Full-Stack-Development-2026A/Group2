/**
 * HTTP Client with automatic token refresh on 401.
 * Refresh token is sent via HTTP-only cookie automatically.
 * Access token is sent in Authorization header.
 */

let refreshTokenFn = null;
let getAccessTokenFn = null;
let setAccessTokenFn = null;
let refreshTokenPromise = null;

/**
 * Initialize HTTP client with auth callbacks.
 * Should be called once during app setup from AuthProvider.
 */
export function initHttpClient(refreshFn, getTokenFn, setTokenFn) {
    refreshTokenFn = refreshFn;
    getAccessTokenFn = getTokenFn;
    setAccessTokenFn = setTokenFn;
}

/**
 * Attempts to refresh the access token.
 * Prevents simultaneous refresh requests.
 */
async function performTokenRefresh() {
    if (!refreshTokenPromise) {
        refreshTokenPromise = (async () => {
            try {
                if (!refreshTokenFn) {
                    throw new Error("HTTP client not initialized");
                }
                const result = await refreshTokenFn();
                if (result?.accessToken) {
                    setAccessTokenFn(result.accessToken);
                    return result.accessToken;
                }
                return "";
            } catch {
                return "";
            } finally {
                refreshTokenPromise = null;
            }
        })();
    }

    return refreshTokenPromise;
}

/**
 * Main fetch wrapper with automatic 401 handling.
 */
async function httpFetch(url, options = {}) {
    const token = getAccessTokenFn?.();
    const fetchOptions = {
        ...options,
        credentials: "include",
        headers: {
            ...options.headers,
        },
    };

    // Add authorization header if token exists
    if (token) {
        fetchOptions.headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(url, fetchOptions);

    // If 401 Unauthorized, try to refresh token and retry
    if (response.status === 401) {
        const refreshedToken = await performTokenRefresh();
        if (refreshedToken) {
            // Retry with new token
            const newToken = refreshedToken || getAccessTokenFn?.();
            const retryOptions = {
                ...fetchOptions,
                headers: {
                    ...fetchOptions.headers,
                },
            };
            if (newToken) {
                retryOptions.headers["Authorization"] = `Bearer ${newToken}`;
            }
            response = await fetch(url, retryOptions);
        }
    }

    return response;
}

/** GET request */
export async function httpGet(url, options = {}) {
    return httpFetch(url, {
        ...options,
        method: "GET",
    });
}

/** POST request */
export async function httpPost(url, body, options = {}) {
    return httpFetch(url, {
        ...options,
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        body: JSON.stringify(body),
    });
}

/** PUT request */
export async function httpPut(url, body, options = {}) {
    return httpFetch(url, {
        ...options,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        body: JSON.stringify(body),
    });
}

/** PATCH request */
export async function httpPatch(url, body, options = {}) {
    return httpFetch(url, {
        ...options,
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        body: JSON.stringify(body),
    });
}

/** DELETE request */
export async function httpDelete(url, options = {}) {
    return httpFetch(url, {
        ...options,
        method: "DELETE",
    });
}
