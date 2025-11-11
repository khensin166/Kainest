import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// === Interceptor Request ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === Interceptor Response (Diperbaiki) ===
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Buat jadi async
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn("Sesi tidak valid atau telah berakhir. Melakukan logout...");

      // 1. Impor store HANYA di dalam fungsi ini
      // Ini memutus circular dependency
      const { useAuthStore } = await import(
        "@/features/auth/presentation/stores/authStore"
      );
      const authStore = useAuthStore();

      // 2. Panggil aksi logout
      authStore.logout();
    }

    // Tetap teruskan error
    return Promise.reject(error);
  }
);

export default api;
