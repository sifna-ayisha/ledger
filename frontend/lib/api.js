import axios from "axios";

function withApiPrefix(url) {
  const normalized = (url || "").trim().replace(/\/+$/, "");
  if (!normalized) return "http://localhost:5000/api";
  return normalized.endsWith("/api") ? normalized : `${normalized}/api`;
}

export const api = axios.create({
  baseURL: withApiPrefix(process.env.NEXT_PUBLIC_API_URL),
  timeout: 15000,
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
  else delete api.defaults.headers.common.Authorization;
}

api.interceptors.response.use((res) => res, (error) => Promise.reject(error.response?.data || error));
