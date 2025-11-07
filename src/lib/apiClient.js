import axios from "axios";
// 1. Tetap impor store di sini
import { useAuthStore } from "@/features/auth/presentation/stores/authStore";

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
  (error) => {
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn("Sesi tidak valid atau telah berakhir. Melakukan logout...");

      // 2. Panggil store DI DALAM fungsi
      const authStore = useAuthStore();

      // 3. Biarkan store yang mengurus sisanya
      // (logout() akan menghapus token, mereset state, dan me-redirect)
      authStore.logout();

      // 4. Hapus side-effect navigasi dan localStorage dari sini
      // localStorage.removeItem("authToken"); // Dihapus
      // window.location.href = "/login"; // Dihapus
    }

    // Tetap teruskan error agar repository bisa menangani .left (Failure)
    return Promise.reject(error);
  }
);

export default api;
