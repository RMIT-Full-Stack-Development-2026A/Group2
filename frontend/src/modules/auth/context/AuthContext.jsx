import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { getProfile } from "../../profile/services/profile.service";
import { logoutUser, refreshToken } from "../services/auth.service";
import { initHttpClient } from "../../../lib/httpClient";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
    const [accessToken, setAccessToken] = useState("");
    const [user, setUser] = useState(null);
    const [isLoadingAuth, setIsLoadingAuth] = useState(true);
    const accessTokenRef = useRef("");

    useEffect(() => {
        accessTokenRef.current = accessToken;
    }, [accessToken]);

    // On app mount, try to restore session using refresh token (in HTTP-only cookie)
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await refreshToken();
                if (data?.accessToken && data?.user) {
                    accessTokenRef.current = data.accessToken;
                    setAccessToken(data.accessToken);
                    setUser(data.user);
                }
            } catch {
                // No valid refresh token or session expired
                accessTokenRef.current = "";
                setAccessToken("");
                setUser(null);
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
    }, []);

    const persistSession = useCallback((token, nextUser) => {
        accessTokenRef.current = token ?? "";
        setAccessToken(token ?? "");
        setUser(nextUser ?? null);
    }, []);

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

    /** Re-fetch GET /api/profile and update `user` (navbar, profile card, etc.). */
    const refreshUser = useCallback(async () => {
        const next = await getProfile();
        if (next) {
            setUser(next);
        }
        return next;
    }, []);

    const value = useMemo(
        () => ({
            accessToken,
            user,
            isAuthenticated: Boolean(accessToken),
            isLoadingAuth,
            login,
            logout,
            refreshUser,
        }),
        [accessToken, user, isLoadingAuth, login, logout, refreshUser],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
