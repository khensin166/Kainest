import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Expires": "0"
  },
});

// === Interceptor Request ===
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
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
    const status = error.response?.status;

    // 401 = belum/tidak lagi terautentikasi -> sesi memang harus diakhiri.
    if (status === 401) {
      console.warn("Sesi tidak valid atau telah berakhir. Melakukan logout...");
      // Store di-import di dalam handler untuk memutus circular dependency.
      const { useAuthStore } = await import(
        "@/features/auth/presentation/stores/authStore"
      );
      useAuthStore().logout();
    }

    // 403 = SUDAH login, tetapi tidak diizinkan — misalnya fitur yang butuh
    // pasangan tertaut, atau halaman khusus admin. Ini BUKAN alasan mengakhiri
    // sesi. Sebelumnya 403 ikut memicu logout, sehingga pengguna yang membuka
    // fitur berpasangan tanpa pasangan justru terlempar keluar sendiri.
    else if (status === 403) {
      const { useModalStore } = await import("@/stores/modalStore");
      useModalStore().openModal({
        newTitle: "Belum Bisa Diakses",
        newMessage:
          error.response?.data?.message ||
          "Fitur ini baru bisa dipakai setelah kamu menautkan pasangan. Buka Pengaturan → Pasangan untuk menautkannya.",
        newStatus: "warning",
      });
      // Ditandai agar notify.error() tidak memunculkan toast di atas modal ini.
      error.__handled = true;
    }

    // Tetap teruskan error
    return Promise.reject(error);
  }
);

export default api;
