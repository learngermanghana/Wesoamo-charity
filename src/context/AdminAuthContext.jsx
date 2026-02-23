import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { refreshAdminSession } from "../services/firebaseAuth";

const STORAGE_KEY = "wesoamo_admin_session";
const AdminAuthContext = createContext(null);

function parseJwtClaims(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isExpired(claims) {
  if (!claims?.exp) return false;
  return claims.exp * 1000 <= Date.now();
}

function isNearExpiry(claims, thresholdMs = 60_000) {
  if (!claims?.exp) return false;
  return claims.exp * 1000 - Date.now() <= thresholdMs;
}

function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { idToken: "", refreshToken: "" };
    const parsed = JSON.parse(raw);
    return {
      idToken: parsed?.idToken || "",
      refreshToken: parsed?.refreshToken || ""
    };
  } catch {
    return { idToken: "", refreshToken: "" };
  }
}

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [refreshing, setRefreshing] = useState(false);

  const claims = useMemo(() => (session.idToken ? parseJwtClaims(session.idToken) : null), [session.idToken]);
  const isAuthenticated = Boolean(session.idToken && !isExpired(claims));
  const isAdmin = isAuthenticated;

  const saveSession = useCallback(({ idToken = "", refreshToken = "" }) => {
    const nextSession = {
      idToken,
      refreshToken: refreshToken || session.refreshToken || ""
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, [session.refreshToken]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession({ idToken: "", refreshToken: "" });
  }, []);

  const refreshTokenIfNeeded = useCallback(async (force = false) => {
    if (!session.refreshToken) {
      if (force) {
        logout();
      }
      return "";
    }

    const tokenClaims = session.idToken ? parseJwtClaims(session.idToken) : null;
    if (!force && session.idToken && !isNearExpiry(tokenClaims)) {
      return session.idToken;
    }

    setRefreshing(true);
    try {
      const refreshed = await refreshAdminSession(session.refreshToken);
      const nextSession = {
        idToken: refreshed.id_token || "",
        refreshToken: refreshed.refresh_token || session.refreshToken
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
      setSession(nextSession);
      return nextSession.idToken;
    } catch {
      logout();
      return "";
    } finally {
      setRefreshing(false);
    }
  }, [logout, session.idToken, session.refreshToken]);

  useEffect(() => {
    if (!session.idToken || !session.refreshToken) return;
    if (!isNearExpiry(claims)) return;
    refreshTokenIfNeeded();
  }, [claims, refreshTokenIfNeeded, session.idToken, session.refreshToken]);

  return (
    <AdminAuthContext.Provider
      value={{
        idToken: session.idToken,
        claims,
        isAuthenticated,
        isAdmin,
        refreshing,
        saveSession,
        logout,
        refreshTokenIfNeeded
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return ctx;
}
