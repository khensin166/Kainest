// 📄 src/lib/api.js (FILE BARU)

import axios from "axios";
import { useAuthStore } from "@/features/auth/presentation/stores/authStore";

// URL base dari backend Hono.js Anda
const API_BASE_URL = "https://kainest-be.vercel.app";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// === Interceptor Request ===
// Fungsi ini akan berjalan SEBELUM setiap request dikirim.
// Tugasnya adalah mengambil token dari localStorage dan menambahkannya ke header.
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

// === Interceptor Response ===
// Fungsi ini berjalan SETELAH kita mendapat respons dari server.
// Tugasnya adalah menangani error global, terutama '401 Unauthorized'.
api.interceptors.response.use(
  (response) => {
    // Jika respons sukses, teruskan saja
    return response;
  },
  (error) => {
    // Jika error-nya adalah 401 (Unauthorized) atau 403 (Forbidden)
    if (error.response && [401, 403].includes(error.response.status)) {
      console.warn("Sesi tidak valid atau telah berakhir. Melakukan logout...");
      // Panggil fungsi logout dari store untuk membersihkan state
      // Kita gunakan 'useAuthStore.getState()' jika di luar setup/komponen
      // Tapi karena ini file JS biasa, kita panggil localStorage langsung
      localStorage.removeItem("authToken");
      
      // Arahkan ke halaman login
      // Kita tidak bisa pakai router di sini, jadi kita reload halaman
      // Router guard akan menangani sisanya.
      window.location.href = "/login";
    }
    
    // Teruskan error agar bisa ditangani oleh block .catch() di repository
    return Promise.reject(error);
  }
);

export default api;