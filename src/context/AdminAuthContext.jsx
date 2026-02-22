import { createContext, useContext, useMemo, useState } from "react";

const STORAGE_KEY = "wesoamo_admin_id_token";
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


export function AdminAuthProvider({ children }) {
  const [idToken, setIdToken] = useState(() => localStorage.getItem(STORAGE_KEY) || "");

  const claims = useMemo(() => (idToken ? parseJwtClaims(idToken) : null), [idToken]);
  const isAuthenticated = Boolean(idToken && !isExpired(claims));
  const isAdmin = isAuthenticated;

  const saveToken = (token) => {
    localStorage.setItem(STORAGE_KEY, token);
    setIdToken(token);
  };

  const saveSession = ({ idToken: nextToken }) => {
    saveToken(nextToken || "");
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIdToken("");
  };

  return (
    <AdminAuthContext.Provider value={{ idToken, claims, isAuthenticated, isAdmin, saveToken, saveSession, logout }}>
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
