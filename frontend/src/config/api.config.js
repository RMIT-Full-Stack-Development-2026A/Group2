const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");
export const API_PREFIX = "/api";

export const AUTH_TOKEN_KEY = "accessToken";
export const AUTH_USER_KEY = "authUser";

export const API_TIMEOUT_MS = 15000;

export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    profile: "/auth/profile",
  },
  game: {
    createSinglePlayer: "/game/sessions/single-player",
    createLocalGame: "/game/sessions/local",
    createOnlineGame: "/game/sessions/online",
    getSession: (id) => `/game/sessions/${id}`,
    makeMove: (id) => `/game/sessions/${id}/moves`,
    abortSession: (id) => `/game/sessions/${id}/abort`,
  },
  subscription: {
    getPlans: "/subscription/plans",
    getCurrent: "/subscription/current",
    subscribe: "/subscription/subscribe",
    cancel: "/subscription/cancel",
    getWallet: "/subscription/wallet",
    topUpWallet: "/subscription/wallet/top-up",
  },
  admin: {
    getPlayers: "/admin/players",
    getPlayer: (id) => `/admin/players/${id}`,
    getRooms: "/admin/rooms",
    getRoom: (id) => `/admin/rooms/${id}`,
    getStats: "/admin/stats",
  },
};

export function buildApiUrl(path = "") {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (!path) {
    return `${API_BASE_URL}${API_PREFIX}`;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  if (normalizedPath.startsWith(API_PREFIX)) {
    return `${API_BASE_URL}${normalizedPath}`;
  }

  return `${API_BASE_URL}${API_PREFIX}${normalizedPath}`;
}

export function getAuthToken() {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    return window.localStorage.getItem(AUTH_TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function getAuthHeaders(extraHeaders = {}) {
  const token = getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...extraHeaders,
  };

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function inferErrorMessage(data, response) {
  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data && typeof data === "object") {
    if (typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }

    if (typeof data.error === "string" && data.error.trim()) {
      return data.error;
    }
  }

  return `Request failed with status ${response.status}`;
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.toLowerCase().includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export async function apiRequest(path, options = {}) {
  const {
    timeoutMs = API_TIMEOUT_MS,
    headers = {},
    signal,
    credentials,
    ...fetchOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  let abortListener = null;
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      abortListener = () => controller.abort();
      signal.addEventListener("abort", abortListener, { once: true });
    }
  }

  const requestHeaders = getAuthHeaders(headers);
  const isFormDataBody =
    typeof FormData !== "undefined" && fetchOptions.body instanceof FormData;

  if (isFormDataBody) {
    delete requestHeaders["Content-Type"];
  }

  try {
    const response = await fetch(buildApiUrl(path), {
      ...fetchOptions,
      credentials: credentials ?? "include",
      headers: requestHeaders,
      signal: controller.signal,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      const error = new Error(inferErrorMessage(data, response));
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error(`Request timed out after ${timeoutMs}ms`);
      timeoutError.status = 408;
      timeoutError.data = { message: timeoutError.message };
      throw timeoutError;
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
    if (signal && abortListener) {
      signal.removeEventListener("abort", abortListener);
    }
  }
}
