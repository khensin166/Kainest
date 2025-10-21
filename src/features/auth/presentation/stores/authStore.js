// 📄 features/auth/presentation/stores/authStore.js (GANTI TOTAL)

import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { AuthRepository } from "../../data/repository/AuthRepository";
import { LoginUserUseCase } from "../../domain/use-cases/LoginUserUseCase";
import { RegisterUserUseCase } from "../../domain/use-cases/RegisterUserUseCase";
import { GetCurrentUserUseCase } from "../../domain/use-cases/GetCurrentUserUseCase";
import { LogoutUserUseCase } from "../../domain/use-cases/LogoutUserUseCase";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";

// Hapus 'import { supabase }'

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const error = ref(null);
  const isLoading = ref(false);

  // Status untuk menandakan apakah pengecekan auth awal sudah selesai
  const isAuthReady = ref(false);

  const modalStore = useModalStore();
  const repository = new AuthRepository();
  const loginUseCase = new LoginUserUseCase(repository);
  const registerUseCase = new RegisterUserUseCase(repository);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(repository);
  const logoutUseCase = new LogoutUserUseCase(repository);

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
      const result = await getCurrentUserUseCase.execute();

      if (result.right) {
        // Sukses: result.right adalah UserEntity atau null
        user.value = result.right;
        isAuthenticated.value = !!result.right; // true jika user ada, false jika null
        console.log("Inisialisasi auth sukses.", { user: user.value, isAuthenticated: isAuthenticated.value });
      } else {
        // Gagal (misal: server down, bukan token salah)
        user.value = null;
        isAuthenticated.value = false;
        error.value = mapFailureToMessage(result.left);
        console.error("Inisialisasi auth gagal:", error.value);
      }
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
      credentials.password
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

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAuthReady, // <-- Tambahkan ini
    login,
    logout,
    initializeAuth,
    register,
  };
});