import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { logoutUser, refreshToken } from "../services/auth.service";
import { initHttpClient } from "../../../lib/httpClient";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../../config/api.config";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const accessTokenRef = useRef("");

    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    const syncStoredSession = useCallback((token, nextUser) => {
        if (typeof window === "undefined") {
            return;
        }

        try {
            if (token) {
                window.localStorage.setItem(AUTH_TOKEN_KEY, token);
            } else {
                window.localStorage.removeItem(AUTH_TOKEN_KEY);
            }

            if (nextUser) {
                window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser));
            } else {
                window.localStorage.removeItem(AUTH_USER_KEY);
            }
        } catch {
            // Ignore storage write failures and keep in-memory auth state.
        }
    }, []);

    // On app mount, try to restore session using refresh token (in HTTP-only cookie)
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await refreshToken();
                if (data?.accessToken && data?.user) {
                    accessTokenRef.current = data.accessToken;
                    setAccessToken(data.accessToken);
                    setUser(data.user);
                    syncStoredSession(data.accessToken, data.user);
                }
            } catch {
                // No valid refresh token or session expired
                accessTokenRef.current = "";
                setAccessToken("");
                setUser(null);
                syncStoredSession("", null);
            } finally {
                setIsLoadingAuth(false);
            }
        };

        // Initialize HTTP client with token refresh callbacks
        initHttpClient(
            refreshToken,
            () => accessTokenRef.current,
            setAccessToken,
        );

        restoreSession();
    }, [syncStoredSession]);

    const persistSession = useCallback((token, nextUser) => {
        accessTokenRef.current = token ?? "";
        setAccessToken(token ?? "");
        setUser(nextUser ?? null);
        syncStoredSession(token ?? "", nextUser ?? null);
    }, [syncStoredSession]);

    const login = useCallback(
        (token, nextUser) => {
            persistSession(token, nextUser);
        },
        [persistSession],
    );

    const logout = useCallback(async () => {
        try {
            await logoutUser();
        } catch {
            // Clear local session even when logout request fails.
        }
        persistSession("", null);
    }, [persistSession]);

    /** Re-fetch GET /api/profile without mutating auth session identity. */
    const refreshUser = useCallback(async () => {
        return getProfile();
    }, []);

    const value = useMemo(
        () => ({
            accessToken,
            user,
            isAuthenticated: Boolean(accessToken),
            isLoadingAuth,
            login,
            logout,
        }),
        [accessToken, user, isLoadingAuth, login, logout],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
