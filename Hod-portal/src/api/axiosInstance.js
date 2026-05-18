import axios from "axios";

const API_BASE_URL = "https://campus-connect-backend-hlty.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Bearer token to every request automatically (except login)
api.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    if (!url.includes("/auth/login")) {
      const token = localStorage.getItem("accessToken");
      // ── DEBUG: remove after confirming token flow ──
      console.log(
        `[API] ${config.method?.toUpperCase()} ${url}`,
        token ? `✅ Token: ${token.slice(0, 20)}...` : "❌ NO TOKEN in localStorage"
      );
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // ── DEBUG ──
    console.error(
      `[API] ${status} on ${url}`,
      error.response?.data
    );

    // 401 = token missing/expired. 
    // We removed 403 from here so it doesn't log you out if you just lack permissions.
    if (status === 401 && !url.includes("/auth/login")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
