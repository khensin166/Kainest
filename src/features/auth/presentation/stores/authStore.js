import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { AuthRepository } from "../../data/repository/AuthRepository";
import { LoginUserUseCase } from "../../domain/use-cases/LoginUserUseCase";
import { RegisterUserUseCase } from "../../domain/use-cases/RegisterUserUseCase";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";
// ... (impor failure lainnya) ...

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const token = ref(localStorage.getItem("auth_token") || null);
  const isAuthenticated = ref(false);
  const error = ref(null);
  const isLoading = ref(false);

  const modalStore = useModalStore();
  const repository = new AuthRepository();
  const loginUseCase = new LoginUserUseCase(repository);
  // const getProfileUseCase = new GetProfileUseCase(repository);
  // const logoutUseCase = new LogoutUserUseCase(repository);
  const registerUseCase = new RegisterUserUseCase(repository); // ✅ Buat instance use case baru

  /**
   * ✅ TAMBAHKAN INI: Action untuk menangani login
   */
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
      user.value = result.right;
      isAuthenticated.value = true;
      isLoading.value = false;

      modalStore.openModal({
        newTitle: "Login Berhasil!",
        newMessage: `Selamat datang kembali, ${user.value.displayName}!`,
        newStatus: "success",
      });
    }
  }

  /**
   * ✅ TAMBAHKAN INI: Action untuk menangani registrasi
   */
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

      // Tampilkan modal error
      modalStore.openModal({
        newTitle: "Registrasi Gagal",
        newMessage: message,
        newStatus: "error",
      });

      throw new Error(message); // Lemparkan error agar komponen bisa menangani jika perlu
    } else {
      // Sukses
      isLoading.value = false;

      // Tampilkan modal sukses
      modalStore.openModal({
        newTitle: "Registrasi Berhasil!",
        newMessage: `Akun untuk ${credentials.email} telah dibuat. Silakan login.`,
        newStatus: "success",
      });

      return result.right; // Kembalikan user entity jika perlu
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    // logout,
    // initializeAuth,
    register, // ✅ Ekspor action baru
  };
});
