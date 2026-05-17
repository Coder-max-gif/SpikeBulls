import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, clearSession, getStoredUser, setSession } from "../lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(true);

  const refreshMe = useCallback(async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("spb_user", JSON.stringify(res.data));
    } catch (_) {
      // ignore
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (getStoredUser()) {
        await refreshMe();
      }
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshMe]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    setSession(res.data);
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async ({ name, email, password }) => {
    const res = await api.post("/auth/register", { name, email, password });
    setSession(res.data);
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const updateProfile = async (payload) => {
    const res = await api.patch("/auth/me", payload);
    setUser(res.data);
    localStorage.setItem("spb_user", JSON.stringify(res.data));
    return res.data;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
    updateProfile,
    refreshMe,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
