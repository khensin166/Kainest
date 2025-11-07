// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useAuthStore } from "./features/auth/presentation/stores/authStore";

// Impor CSS Tailwind Anda
import './css/style.css'

async function startApp() {
  const app = createApp(App);
  const pinia = createPinia();

  app.use(pinia);

  // === PERUBAHAN PENTING DI SINI ===
  // 1. Buat instance auth store
  const authStore = useAuthStore();

  // 2. Tunggu inisialisasi auth selesai
  await authStore.initializeAuth();
  // ==================================

  // Baru pasang router SETELAH auth siap
  app.use(router);

  // Baru mount aplikasi SETELAH auth siap
  app.mount("#app");
}

// Jalankan fungsi async untuk memulai aplikasi
startApp();