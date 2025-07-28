import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { AuthRepository } from "../../data/repository/AuthRepository";
import { LoginUserUseCase } from "../../domain/use-cases/LoginUserUseCase";
import { RegisterUserUseCase } from "../../domain/use-cases/RegisterUserUseCase";
import { GetCurrentUserUseCase } from "../../domain/use-cases/GetCurrentUserUseCase";
import { LogoutUserUseCase } from "../../domain/use-cases/LogoutUserUseCase";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";
import { supabase } from "@/lib/supabase";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isAuthenticated = ref(false);
  const error = ref(null);
  const isLoading = ref(false);

  const modalStore = useModalStore();
  const repository = new AuthRepository();
  const loginUseCase = new LoginUserUseCase(repository);
  const registerUseCase = new RegisterUserUseCase(repository);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(repository);
  const logoutUseCase = new LogoutUserUseCase(repository);

  function initializeAuth() {
    return new Promise((resolve) => {
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event);

        // ✅ Gunakan try...finally untuk memastikan resolve() selalu dipanggil
        try {
          if (event === "INITIAL_SESSION" || event === "SIGNED_IN") {
            if (session) {
              const result = await getCurrentUserUseCase.execute();
              if (result.right) {
                user.value = result.right;
                isAuthenticated.value = true;
              } else {
                // ✅ Tambahkan log error untuk debugging
                console.error(
                  "Gagal mengambil profil saat inisialisasi:",
                  result.left
                );
                user.value = null;
                isAuthenticated.value = false;
              }
            } else {
              user.value = null;
              isAuthenticated.value = false;
            }
          } else if (event === "SIGNED_OUT") {
            user.value = null;
            isAuthenticated.value = false;
          }
        } catch (e) {
          console.error("Terjadi error tak terduga di onAuthStateChange:", e);
          user.value = null;
          isAuthenticated.value = false;
        } finally {
          // ✅ Pastikan main.js bisa melanjutkan eksekusi
          console.log("Inisialisasi auth selesai, melanjutkan aplikasi.");
          resolve();
        }
      });
    });
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
      // State user dan isAuthenticated akan di-handle oleh onAuthStateChange
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
      isLoading.value = false;

      modalStore.openModal({
        newTitle: "Registrasi Berhasil!",
        newMessage: `Akun untuk ${credentials.email} telah dibuat. Silakan cek email Anda untuk verifikasi.`,
        newStatus: "success",
      });

      return result.right;
    }
  }

  async function logout() {
    isLoading.value = true;
    const result = await logoutUseCase.execute();
    if (result.left) {
      modalStore.openModal({
        newTitle: "Logout Gagal",
        newMessage: "Gagal mengakhiri sesi di server, sesi lokal akan dihapus.",
        newStatus: "error",
      });
    }
    // State akan di-reset secara otomatis oleh onAuthStateChange
    isLoading.value = false;
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    initializeAuth,
    register,
  };
});
