import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, "")}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const legacyAdminInfo = localStorage.getItem("adminInfo");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else if (legacyAdminInfo) {
        try {
          const parsed = JSON.parse(legacyAdminInfo);
          if (parsed?.token) {
            config.headers.Authorization = `Bearer ${parsed.token}`;
          }
        } catch {
          // Ignore malformed legacy data.
        }
      }

      if (window.location.pathname.startsWith("/admin")) {
        config.headers["X-Admin-Panel"] = "true";
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("adminInfo");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
