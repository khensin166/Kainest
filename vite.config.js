import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  esbuild: {
    pure: ["console.log", "console.info", "console.debug"],
    // cara hapus console logging di prod
  },
  define: {
    "process.env": process.env,
  },
  plugins: [tailwindcss(), vue(), Icons({ compiler: "vue3", scale: 1 })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // manualChunks SENGAJA TIDAK DIPAKAI.
    // Konfigurasi lama memakai `id.includes("vue")` yang menyapu 8 paket
    // (@vue, @vueuse, vue-router, vue-chartjs, vue-flatpickr-component,
    // vue3-toastify, qrcode.vue) ke chunk "vendor-vue", sementara reka-ui,
    // chart.js, dan flatpickr masuk "vendor-core". Kedua chunk jadi saling
    // bergantung, dan Rollup tidak bisa menjamin urutan inisialisasinya:
    //   ReferenceError: Cannot access 'Bu' before initialization
    // Error itu HANYA muncul di build produksi, tidak di dev server — sehingga
    // lolos sampai ke Vercel dan membuat halaman kosong.
    // Pemecahan chunk otomatis Rollup aman terhadap siklus; biarkan dia bekerja.
    // (Opsional) Jika masih ada chunk di atas 500kb, naikkan batas warning agar terminal tidak berisik
    chunkSizeWarningLimit: 600,
  },
});
