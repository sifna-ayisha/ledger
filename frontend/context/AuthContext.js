"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api, setAuthToken } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("profitflow_auth") : null;
    if (!saved) {
      setLoading(false);
      return;
    }
    const parsed = JSON.parse(saved);
    setUser(parsed.user);
    setToken(parsed.token);
    setAuthToken(parsed.token);
    setLoading(false);
  }, []);

  const persist = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    setAuthToken(payload.token);
    localStorage.setItem("profitflow_auth", JSON.stringify(payload));
  };

  const login = async (values) => {
    const { data } = await api.post("/auth/login", values);
    persist(data.data);
    toast.success("Welcome back");
    router.push("/dashboard");
  };

  const adminLogin = async (values) => {
    const { data } = await api.post("/auth/admin-login", values);
    persist(data.data);
    toast.success("Welcome, admin");
    router.push("/dashboard");
  };

  const register = async (values) => {
    const { data } = await api.post("/auth/register", values);
    persist(data.data);
    toast.success("Account created");
    router.push("/dashboard");
  };

  const updateProfile = async (values) => {
    const { data } = await api.put("/auth/profile", values);
    const payload = { user: data.data.user, token };
    persist(payload);
    toast.success("Profile updated");
    return data.data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem("profitflow_auth");
    router.push("/login");
  };

  const value = useMemo(() => ({ user, token, loading, login, adminLogin, register, logout, updateProfile, isAuthenticated: Boolean(token) }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
