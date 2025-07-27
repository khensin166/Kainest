import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./features/auth/presentation/stores/authStore";

// Impor Layout
import DashboardLayout from "./layouts/DashboardLayout.vue";

// Impor Halaman (Sesuaikan dengan nama file halaman fitur Anda nanti)
import LoginPage from "./features/auth/presentation/pages/LoginPage.vue";
import RegisterPage from "./features/auth/presentation/pages/RegisterPage.vue";
import GetStartedPage from "./features/auth/presentation/pages/GetStartedPage.vue";
import Dashboard from "./pages/Dashboard.vue"; // Ganti dengan halaman dashboard Kenin
import TodoListPage from "./pages/Dashboard.vue"; // Ganti dengan halaman To-do List
import GalleryPage from "./pages/Dashboard.vue"; // Ganti dengan halaman Galeri
import CalendarPage from "./pages/Dashboard.vue"; // Ganti dengan halaman Kalender
import VaultPage from "./pages/Dashboard.vue"; // Ganti dengan halaman Vault
import SettingsPage from "./features/settings/presentation/pages/SettingsPage.vue";
import Forbidden from "./partials/Forbidden.vue";
import NotFound from "./partials/Forbidden.vue"; // Asumsi 404 sama dengan Forbidden

const routes = [
  // Halaman publik yang tidak menggunakan layout utama
  {
    path: "/",
    name: "GetStarted",
    component: GetStartedPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/Register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/utility/403",
    name: "Forbidden",
    component: Forbidden,
  },

  // Halaman terproteksi yang menggunakan DashboardLayout
  {
    path: "/",
    component: DashboardLayout,
    meta: { requiresAuth: true }, // ✅ Tandai semua child route di sini butuh login
    children: [
      { path: "", redirect: "/dashboard" },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "todos",
        name: "TodoList",
        component: TodoListPage, // Ganti dengan komponen To-do Anda
      },
      {
        path: "gallery",
        name: "Gallery",
        component: GalleryPage, // Ganti dengan komponen Galeri Anda
      },
      {
        path: "calendar",
        name: "Calendar",
        component: CalendarPage, // Ganti dengan komponen Kalender Anda
      },
      {
        path: "vault",
        name: "Vault",
        component: VaultPage, // Ganti dengan komponen Vault Anda
      },
      {
        path: "settings",
        name: "Settings",
        component: SettingsPage,
      },
    ],
  },

  // Route Catch-all untuk halaman tidak ditemukan (404)
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ Navigation guard yang sudah disederhanakan
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // Cek apakah route atau parent-nya memiliki meta 'requiresAuth'
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    // Jika butuh login tapi belum login, redirect ke halaman Login
    next({ name: "Login" });
  } else if (to.name === "Login" && authStore.isAuthenticated) {
    // Jika sudah login tapi mencoba akses halaman login, redirect ke dashboard
    next({ path: "/dashboard" });
  } else {
    // Jika tidak ada masalah, izinkan akses
    next();
  }
});

export default router;
