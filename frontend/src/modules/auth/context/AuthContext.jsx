import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { logoutUser } from "../services/auth.service";

const AuthContext = createContext(null);

const STORAGE_TOKEN = "accessToken";
const STORAGE_USER = "authUser";

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem(STORAGE_TOKEN) ?? "",
  );
  const [user, setUser] = useState(readStoredUser);

  const persistSession = useCallback((token, nextUser) => {
    if (token) {
      localStorage.setItem(STORAGE_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_TOKEN);
    }
    if (nextUser) {
      localStorage.setItem(STORAGE_USER, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(STORAGE_USER);
    }
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
      /* still clear client session */
    }
    persistSession("", null);
  }, [persistSession]);

  const value = useMemo(
    () => ({
      accessToken,
      user,
      isAuthenticated: Boolean(accessToken),
      login,
      logout,
    }),
    [accessToken, user, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
