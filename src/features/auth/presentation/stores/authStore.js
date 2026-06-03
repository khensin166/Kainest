import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
// import { AuthRepository } from "../../data/repository/AuthRepository"; // DIP: Removed direct dependency
import { 
  loginUserUseCase, 
  registerUserUseCase, 
  getCurrentUserUseCase, 
  logoutUserUseCase,
  socialLoginUseCase,
  forgotPasswordUseCase,
  resetPasswordUseCase
} from "../../../../core/di/di"; // DIP: Injected dependencies
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const error = ref(null);
  const isLoading = ref(false);

  // Status untuk menandakan apakah pengecekan auth awal sudah selesai
  const isAuthReady = ref(false);

  // RBAC Getters & Methods
  const isAdmin = computed(() => {
    return user.value?.role === "admin";
  });

  const hasPermission = (permission) => {
    if (isAdmin.value) return true; // Admin has all permissions
    return user.value?.permissions?.includes(permission) || false;
  };

  const modalStore = useModalStore();
  
  // DIP Refactoring: No more 'new Class()' here.
  // const repository = new AuthRepository();
  const loginUseCase = loginUserUseCase;
  const registerUseCase = registerUserUseCase;
  const getCurrentUserUseCaseInstance = getCurrentUserUseCase; // Renamed to avoid collision if needed, but simple variable assignment works
  const logoutUseCase = logoutUserUseCase;
  const forgotPasswordUseCaseInstance = forgotPasswordUseCase;
  const resetPasswordUseCaseInstance = resetPasswordUseCase;

  /**
   * PERUBAHAN BESAR: Menginisialisasi status auth saat aplikasi dimuat.
   * Tidak lagi menggunakan onAuthStateChange.
   * Fungsi ini harus dipanggil di main.js SEBELUM app.mount().
   */
  async function initializeAuth() {
    console.log("Memulai inisialisasi status autentikasi...");
    isLoading.value = true;
    isAuthReady.value = false;

    try {
      // Panggil use case yang akan mengecek token di localStorage
      // dan memvalidasinya ke /auth/me
      const result = await getCurrentUserUseCaseInstance.execute();

      // --- LOGIKA DIPERBAIKI DI SINI ---
      if (result.left) {
        // --- Kasus 1: ADA KEGAGALAN NYATA ---
        // (Misal: server down, NetworkFailure)
        user.value = null;
        isAuthenticated.value = false;
        error.value = mapFailureToMessage(result.left);
        console.error("Inisialisasi auth gagal:", error.value);
      } else {
        // --- Kasus 2: TIDAK ADA KEGAGALAN ---
        // result.right bisa berisi UserEntity (jika token valid)
        // atau null (jika token tidak ada / tidak valid)
        user.value = result.right; // Aman, bisa user atau null
        isAuthenticated.value = !!result.right; // true jika user, false jika null
        error.value = null; // Tidak ada error
        console.log("Inisialisasi auth sukses.", {
          user: user.value,
          isAuthenticated: isAuthenticated.value,
        });
      }
      // --- BATAS PERBAIKAN ---
      // if (result.right) {
      //   // Sukses: result.right adalah UserEntity atau null
      //   user.value = result.right;
      //   isAuthenticated.value = !!result.right; // true jika user ada, false jika null
      //   console.log("Inisialisasi auth sukses.", { user: user.value, isAuthenticated: isAuthenticated.value });
      // } else {
      //   // Gagal (misal: server down, bukan token salah)
      //   user.value = null;
      //   isAuthenticated.value = false;
      //   error.value = mapFailureToMessage(result.left);
      //   console.error("Inisialisasi auth gagal:", error.value);
      // }
    } catch (e) {
      console.error("Terjadi error tak terduga saat inisialisasi auth:", e);
      user.value = null;
      isAuthenticated.value = false;
    } finally {
      isLoading.value = false;
      isAuthReady.value = true;
      console.log("Inisialisasi auth selesai.");
    }
  }

  async function login(credentials) {
    isLoading.value = true;
    error.value = null;

    const result = await loginUseCase.execute(
      credentials.email,
      credentials.password,
      credentials.rememberMe
    );

    if (result.left) {
      const failure = result.left;
      const message = mapFailureToMessage(failure);
      error.value = message;
      isLoading.value = false;

      modalStore.openModal({
        newTitle: "Login Gagal",
        newMessage: message,
        newStatus: "error",
      });

      throw new Error(message);
    } else {
      // Sukses
      // Berbeda dari Supabase, kita set user secara manual di sini
      user.value = result.right;
      isAuthenticated.value = true;
      isLoading.value = false;

      modalStore.openModal({
        newTitle: "Login Berhasil!",
        newMessage: `Selamat datang kembali, ${result.right.displayName}!`,
        newStatus: "success",
      });
    }
  }

  async function register(credentials) {
    isLoading.value = true;
    error.value = null;

    const result = await registerUseCase.execute({
      email: credentials.email,
      password: credentials.password,
      displayName: credentials.displayName,
    });

    if (result.left) {
      const failure = result.left;
      const message = mapFailureToMessage(failure);
      error.value = message;
      isLoading.value = false;

      modalStore.openModal({
        newTitle: "Registrasi Gagal",
        newMessage: message,
        newStatus: "error",
      });

      throw new Error(message);
    } else {
      // Sukses
      isLoading.value = false;

      modalStore.openModal({
        newTitle: "Registrasi Berhasil!",
        // Ubah pesan ini, karena tidak ada lagi verifikasi email (kecuali Anda menambahkannya di Hono)
        newMessage: `Akun untuk ${credentials.email} telah dibuat. Silakan login.`,
        newStatus: "success",
      });

      // result.right sekarang adalah 'true', bukan UserEntity
      return true;
    }
  }

  async function loginSocial(provider) {
    isLoading.value = true;
    error.value = null;

    const backendUrl = import.meta.env.VITE_API_BASE_URL;
    const callbackUrl = `${backendUrl}/auth/social-callback`;

    const result = await socialLoginUseCase.execute(provider, callbackUrl);

    if (result.left) {
      const failure = result.left;
      const message = mapFailureToMessage(failure);
      error.value = message;
      isLoading.value = false;

      modalStore.openModal({
        newTitle: "Login Gagal",
        newMessage: message,
        newStatus: "error",
      });

      throw new Error(message);
    } else {
      // Sukses, redirect URL
      const authorizationUrl = result.right;
      window.location.href = authorizationUrl;
      // Jangan set isLoading false agar indikator loading tetap berjalan hingga pindah halaman
    }
  }

  async function logout() {
    isLoading.value = true;
    await logoutUseCase.execute();

    // Reset state secara manual
    user.value = null;
    isAuthenticated.value = false;
    isLoading.value = false;

    // Arahkan ke login (bisa juga ditangani oleh router guard)
    // router.push('/login');
  }

  async function forgotPassword(email) {
    isLoading.value = true;
    error.value = null;
    
    const result = await forgotPasswordUseCaseInstance.execute(email);
    
    if (result.left) {
      const failure = result.left;
      const message = mapFailureToMessage(failure);
      error.value = message;
      isLoading.value = false;
      
      modalStore.openModal({
        newTitle: "Gagal Mengirim Link",
        newMessage: message,
        newStatus: "error",
      });
      
      throw new Error(message);
    } else {
      isLoading.value = false;
      modalStore.openModal({
        newTitle: "Link Terkirim!",
        newMessage: `Kami telah mengirimkan tautan reset password ke ${email}. Silakan cek kotak masuk Anda.`,
        newStatus: "success",
      });
      return true;
    }
  }

  async function resetPassword(newPassword, token) {
    isLoading.value = true;
    error.value = null;
    
    const result = await resetPasswordUseCaseInstance.execute(newPassword, token);
    
    if (result.left) {
      const failure = result.left;
      const message = mapFailureToMessage(failure);
      error.value = message;
      isLoading.value = false;
      
      modalStore.openModal({
        newTitle: "Gagal Mereset Kata Sandi",
        newMessage: message,
        newStatus: "error",
      });
      
      throw new Error(message);
    } else {
      isLoading.value = false;
      modalStore.openModal({
        newTitle: "Kata Sandi Diperbarui!",
        newMessage: "Kata sandi Anda telah berhasil direset. Silakan login menggunakan kata sandi baru Anda.",
        newStatus: "success",
      });
      return true;
    }
  }

  // Aksi untuk memperbarui data user dari store lain
  function setUser(newUserData) {
    user.value = newUserData;
    isAuthenticated.value = !!newUserData;
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAuthReady, // <-- Tambahkan ini
    isAdmin, // RBAC
    hasPermission, // RBAC
    login,
    loginSocial,
    logout,
    forgotPassword,
    resetPassword,
    initializeAuth,
    register,
    setUser,
  };
});
