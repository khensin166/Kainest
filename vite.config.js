import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  define: {
    "process.env": process.env,
  },
  plugins: [tailwindcss(), vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("vue")) return "vendor-vue";
            if (id.includes("pinia")) return "vendor-pinia";
            if (id.includes("axios")) return "vendor-axios";
            if (id.includes("@heroicons") || id.includes("lucide")) return "vendor-icons";
            return "vendor-core"; // semua pustaka eksternal lainnya
          }
        },
      },
    },
    // (Opsional) Jika masih ada chunk di atas 500kb, naikkan batas warning agar terminal tidak berisik
    chunkSizeWarningLimit: 600,
  },
});
