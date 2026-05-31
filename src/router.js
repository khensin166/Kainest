import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "./features/auth/presentation/stores/authStore";

// Impor Layout
import DashboardLayout from "./layouts/DashboardLayout.vue";

// Impor Halaman
import LoginPage from "./features/auth/presentation/pages/LoginPage.vue";
import RegisterPage from "./features/auth/presentation/pages/RegisterPage.vue";
import GetStartedPage from "./features/auth/presentation/pages/GetStartedPage.vue";
import Dashboard from "./pages/Dashboard.vue";
import TodoListPage from "./pages/Dashboard.vue";
import GalleryPage from "./pages/Dashboard.vue";
import CalendarPage from "./pages/Dashboard.vue";
import VaultPage from "./pages/Dashboard.vue";
import SettingsPage from "./features/settings/presentation/pages/SettingsPage.vue";
import Forbidden from "./partials/Forbidden.vue";
import NotFound from "./partials/Forbidden.vue";
import SharedNotePage from "./features/notes/presentation/pages/SharedNotePage.vue";
import ValentinePage from "./features/valentine/presentation/pages/ValentinePage.vue";
import AuthCallbackPage from "./features/auth/presentation/pages/AuthCallbackPage.vue";

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
  
  // ✅ ROUTE UNTUK SHARED NOTES (PUBLIK)
  {
    path: "/share/notes/:id",
    name: "SharedNote",
    component: SharedNotePage,
  },
  
  // ✅ ROUTE VALENTINE (PUBLIK)
  {
    path: "/valentine",
    name: "Valentine",
    component: ValentinePage,
  },

  // ✅ ROUTE CALLBACK SOCIAL LOGIN (PUBLIK)
  // Menerima token dari URL hash (#token=...) setelah OAuth selesai.
  // Tidak pakai requiresAuth karena user belum login saat halaman ini dimuat.
  {
    path: "/app/auth-callback",
    name: "AuthCallback",
    component: AuthCallbackPage,
  },

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
        component: () => import('./features/todos/presentation/pages/TodoPage.vue'),
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
        path: "history",
        name: "FinancialHistory",
        component: () => import('./features/budgeting/presentation/pages/FinancialHistoryPage.vue'),
        meta: { requiredPermission: "budgeting" },
      },
      {
        path: "wabot",
        name: "wabot",
        component: () => import('./features/wabot/presentation/pages/WaBotPage.vue'),
      },
      {
        path: "wabot-api",
        name: "wabot-api",
        component: () => import('./features/wabot/presentation/pages/WaBotApiPage.vue'),
      },
      {
        path: "wabot-backup",
        name: "wabot-backup",
        component: () => import('./features/wabot/presentation/pages/WaBackupPage.vue'),
        meta: { requiredPermission: "wabot" } // Contoh penggunaan permission
      },
      // --- ADMIN ROUTES ---
      {
        path: "admin/users",
        name: "UserManagement",
        component: () => import('./features/admin/presentation/pages/UserManagementPage.vue'),
        meta: { requiresAdmin: true } // Hanya admin
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

// Navigation guard - menunggu inisialisasi auth selesai sebelum membuat keputusan
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Jika auth belum diinisialisasi, tunggu selesai dulu
  // Ini penting untuk social login callback agar sesi cookie sempat dibaca
  if (!authStore.isAuthReady) {
    await authStore.initializeAuth();
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some((record) => record.meta.requiresAdmin);
  
  // Ambil requiredPermission dari meta (jika ada)
  let requiredPermission = null;
  to.matched.forEach((record) => {
    if (record.meta.requiredPermission) {
      requiredPermission = record.meta.requiredPermission;
    }
  });

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Login" });
  } else if (requiresAuth && requiresAdmin && !authStore.isAdmin) {
    // Akses ditolak jika butuh admin tapi user bukan admin
    next({ name: "Forbidden" });
  } else if (requiresAuth && requiredPermission && !authStore.hasPermission(requiredPermission)) {
    // Akses ditolak jika butuh permission tertentu tapi user tidak punya
    next({ name: "Forbidden" });
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
