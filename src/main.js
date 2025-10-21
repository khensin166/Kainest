// // src/main.js
// import { createApp } from "vue";
// import { createPinia } from "pinia";
// import App from "./App.vue";
// import router from "./router"; // Sesuaikan path ke router Anda
// import { useAuthStore } from "./features/auth/presentation/stores/authStore"; // Sesuaikan path
// import './css/style.css'
// // Buat fungsi async untuk memulai aplikasi
// async function startApp() {
//   const app = createApp(App);

//   // 1. Pasang Pinia
//   app.use(createPinia());

//   // 2. Panggil action inisialisasi SEBELUM memasang router
//   const authStore = useAuthStore();
//   await authStore.initializeAuth();

//   // 3. Pasang Router setelah state auth pulih
//   app.use(router);

//   // 4. Mount aplikasi
//   app.mount("#app");
// }

// // Jalankan fungsi untuk memulai aplikasi
// startApp();


// 📄 src/main.js (CONTOH)

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