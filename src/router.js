import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./features/auth/presentation/stores/authStore";

// Impor Layout
import DashboardLayout from "./layouts/DashboardLayout.vue";

// Impor Halaman
import LoginPage from "./features/auth/presentation/pages/LoginPage.vue";
import RegisterPage from "./features/auth/presentation/pages/RegisterPage.vue";
import GetStartedPage from "./features/auth/presentation/pages/GetStartedPage.vue"; // Nama file Anda GetStartedPage.vue
import Dashboard from "./pages/Dashboard.vue";
import TodoListPage from "./pages/Dashboard.vue";
import GalleryPage from "./pages/Dashboard.vue";
import CalendarPage from "./pages/Dashboard.vue";
import VaultPage from "./pages/Dashboard.vue";
import SettingsPage from "./features/settings/presentation/pages/SettingsPage.vue";
import Forbidden from "./partials/Forbidden.vue";
import NotFound from "./partials/Forbidden.vue";
import SharedNotePage from "./features/notes/presentation/pages/SharedNotePage.vue";

const routes = [
  // Halaman publik yang tidak menggunakan layout utama
  {
    // ✅ INI JADI SATU-SATUNYA HALAMAN UTAMA SAAT WEB DIBUKA
    path: "/",
    name: "GetStarted",
    component: GetStartedPage, // Menggunakan nama komponen yang benar
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/register", // Path dibuat lowercase agar konsisten
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
    // ✅ PATH DIUBAH MENJADI '/app'
    path: "/app",
    component: DashboardLayout,
    meta: { requiresAuth: true },
    children: [
      // Redirect dari /app ke /app/dashboard
      { path: "", redirect: "/app/dashboard" },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "todos",
        name: "TodoList",
        component: TodoListPage,
      },
      {
        path: "notes", // Daftar semua notes
        name: "Notes",
        component: () => import('./features/notes/presentation/pages/NotesPage.vue'),
      },
      {
        path: "notes/new", // Halaman editor untuk note BARU
        name: "NewNote",
        component: () => import('./features/notes/presentation/pages/NoteEditorPage.vue'),
      },
      {
        path: "notes/:id", // Halaman editor untuk note yang SUDAH ADA
        name: "EditNote",
        component: () => import('./features/notes/presentation/pages/NoteEditorPage.vue'),
      },
      {
        path: "gallery",
        name: "Gallery",
        component: GalleryPage,
      },
      {
        path: "calendar",
        name: "Calendar",
        component: CalendarPage,
      },
      {
        path: "vault",
        name: "Vault",
        component: VaultPage,
      },
      {
        path: "settings",
        name: "Settings",
        component: SettingsPage,
      },
      {
        path: "budgeting",
        name: "budgeting",
        component: () => import('./features/budgeting/presentation/pages/BudgetDashboardPage.vue'),
      },
      {
        path: "transactions",
        name: "TransactionList",
        component: () => import ('./features/budgeting/presentation/pages/TransactionListPage.vue'),
      },
      {
        path: "wabot",
        name: "wabot",
        component: () => import('./features/wabot/presentation/pages/WaBotPage.vue'),
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

// Navigation guard yang sudah disederhanakan
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Login" });
  } else if (
    (to.name === "Login" ||
      to.name === "Register" ||
      to.name === "GetStarted") &&
    authStore.isAuthenticated
  ) {
    // ✅ JIKA SUDAH LOGIN, JANGAN BIARKAN AKSES GETSTARTED, LOGIN, ATAU REGISTER
    // Langsung arahkan ke dashboard di dalam /app
    next({ path: "/app/dashboard" });
  } else {
    next();
  }
});

export default router;
