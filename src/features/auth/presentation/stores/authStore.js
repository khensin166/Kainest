// File: src/features/auth/presentation/stores/authStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { AuthRepository } from "../../data/repository/AuthRepository";
import { LoginUserUseCase } from "../../domain/use-cases/LoginUserUseCase";
import { GetProfileUseCase } from "../../domain/use-cases/GetProfileUseCase";
import { LogoutUserUseCase } from "../../domain/use-cases/LogoutUserUseCase";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";
import {
  RateLimitFailure,
  IncorrectPasswordFailure,
} from "../../../../core/error/failure";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("auth_token") || null);
  const isAuthenticated = ref(false);
  const error = ref(null);
  const isLoading = ref(false);

  const modalStore = useModalStore();
  const repository = new AuthRepository();
  const loginUseCase = new LoginUserUseCase(repository);
  const getProfileUseCase = new GetProfileUseCase(repository);
  const logoutUseCase = new LogoutUserUseCase(repository);

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

      // PERUBAHAN: Logika untuk menampilkan modal berdasarkan jenis Failure
      if (failure instanceof RateLimitFailure) {
        // Jika error 429, kirim countdown
        modalStore.openModal({
          newTitle: "Terlalu Banyak Percobaan",
          newMessage: message,
          newStatus: "error",
          newCountdown: failure.retryAfterSeconds,
        });
      } else if (failure instanceof IncorrectPasswordFailure) {
        // Jika error 401, kirim pesan spesifik
        modalStore.openModal({
          newTitle: "Login Gagal",
          newMessage: failure.message,
          newStatus: "error",
        });
      } else {
        // Untuk error lainnya
        modalStore.openModal({
          newTitle: "Login Gagal",
          newMessage: message,
          newStatus: "error",
        });
      }

      throw new Error(message);
    } else {
      const data = result.right;
      user.value = data.user;
      token.value = data.token;
      isAuthenticated.value = true;
      isLoading.value = false;

      modalStore.openModal({
        newTitle: "Login Berhasil",
        newMessage: `Selamat datang kembali, ${data.user.name}!`,
        newStatus: "success",
      });
    }
  }

  async function initializeAuth() {
    const existingToken = localStorage.getItem("auth_token");
    if (existingToken) {
      isLoading.value = true;

      const result = await getProfileUseCase.execute(existingToken);

      if (result.left) {
        console.error(
          "Session restore failed:",
          mapFailureToMessage(result.left)
        );
        logout(); // Panggil fungsi logout jika token tidak valid
      } else {
        user.value = result.right;
        token.value = existingToken;
        isAuthenticated.value = true;
      }
      isLoading.value = false;
    }
  }

  async function logout() {
    isLoading.value = true;
    try {
      await logoutUseCase.execute();
    } catch (e) {
      console.error("An error occurred during server logout:", e);
    } finally {
      user.value = null;
      token.value = null;
      isAuthenticated.value = false;
      isLoading.value = false;
      window.location.href = "/";
    }
  }

  // HAPUS FUNGSI initializeAuth() KEDUA DARI SINI

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout, // Hapus duplikasi
    initializeAuth,
  };
});
