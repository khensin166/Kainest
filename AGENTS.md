# 🤖 Kainest Frontend - AI Agent Guidelines

Welcome to the Kainest Frontend project. Please read these guidelines before making changes to the codebase.

## 🛠️ Tech Stack
- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **State Management**: Pinia (`src/features/*/presentation/stores/`)
- **Routing**: Vue Router (`src/router.js`)
- **API Client**: Axios (`src/lib/apiClient.js`)

## 🏗️ Architecture & Structure
This project follows a **Feature-Based Clean Architecture** (Domain-Driven Design), mirroring the backend structure.

```text
src/
├── core/                  # Dependency Injection (`di/di.js`), Error definitions
├── features/              # Feature modules (auth, notes, todos, etc.)
├── layouts/               # Global Vue layouts (e.g., DashboardLayout)
├── lib/                   # Integrations (Axios client)
├── pages/                 # Root pages/views
├── router.js              # Vue Router configuration
└── main.js                # App entry point
```

### Feature Module Structure (e.g., `features/auth/`)
Each feature contains three layers:
- `presentation/`:
  - `pages/`: Vue components acting as main views.
  - `components/`: Reusable UI components specific to the feature.
  - `stores/`: Pinia stores (e.g., `authStore.js`).
- `domain/`:
  - `use-cases/`: Core business logic operations.
  - `repository/`: Interfaces / abstract classes.
- `data/`:
  - `repository/`: Concrete repository implementations.
  - `source/`: Remote data sources (API calls using Axios).
  - `mappers/`: Data transformation logic.

## 💉 Dependency Injection
- DI is managed manually in `src/core/di/di.js`.
- If you create a new Use Case or Repository, **you must register it in `di.js`** and export the instance for use in Stores or Components. This keeps dependencies decoupled.

## 🔒 Authentication Flow
- Auth state is managed by `features/auth/presentation/stores/authStore.js`.
- **Social Login**: Managed by Better Auth on the backend. The backend sets an `httpOnly` session cookie (`__Secure-better-auth.session_token`).
- **Standard Login**: Stores a fallback token in `localStorage` (`authToken`).
- **Initialization**: `authStore.initializeAuth()` checks `/profile` on startup. The Axios interceptor (`src/lib/apiClient.js`) handles 401/403 errors by triggering a logout.
- **Router Guard**: `router.js` uses an `async` guard that waits for `authStore.isAuthReady` before enforcing authentication rules.

## 🛡️ Role-Based Access Control (RBAC) & Admin Feature
- **Permissions**: `UserEntity` includes `role` (e.g., 'admin', 'user') and `permissions` (an array of strings).
- **Access Check**: `authStore.js` provides `isAdmin` (computed getter) and `hasPermission(module_name)` (method).
- **Router Guard**: Routes can be protected using `meta: { requiresAdmin: true }` or `meta: { requiredPermission: 'module_name' }`.
- **UI State**: The `Sidebar.vue` component dynamically renders navigation items based on the user's role and permissions. The Admin User Management page allows administrators to toggle access for specific users.

## 📝 Rules for Agents
- **Use Composition API**: Always use `<script setup>` for Vue components.
- **Respect Clean Architecture**: Vue components should interact with Pinia stores or Use Cases, NOT directly with API sources (`AuthRemoteSource`, etc.).
- **No Circular Dependencies**: Be careful when importing stores inside Axios interceptors. Use dynamic imports if needed (e.g., `const { useAuthStore } = await import(...)`).
