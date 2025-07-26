import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { useAuthStore } from "../../../auth/presentation/stores/authStore";
import { SettingsRepository } from "../../data/repository/SettingsRepository";
import { ChangePasswordUseCase } from "../../domain/use-cases/ChangePasswordUseCase";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";
import { IncorrectPasswordFailure } from "../../../../core/error/failure";

export const useSettingsStore = defineStore("settings", () => {
  const isLoading = ref(false);
  const modalStore = useModalStore();
  const authStore = useAuthStore();

  const repository = new SettingsRepository();
  const changePasswordUseCase = new ChangePasswordUseCase(repository);

  async function updatePassword(passwords) {
    isLoading.value = true;
    const result = await changePasswordUseCase.execute(passwords);
    isLoading.value = false;

    if (result.left) {
      const failure = result.left;
      let message =
        failure instanceof IncorrectPasswordFailure
          ? failure.message // Gunakan pesan spesifik jika password salah
          : mapFailureToMessage(failure);

      modalStore.openModal({
        newTitle: "Gagal Mengubah Password",
        newMessage: message,
        newStatus: "error",
      });
      throw new Error(message);
    } else {
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Password Anda telah berhasil diperbarui.",
        newStatus: "success",
      });
    }
  }

  // Fungsi untuk mengambil profil user dari authStore
  function fetchProfile() {
    if (!authStore.user) {
      // Jika user data belum ada, panggil initializeAuth untuk memuatnya
      return authStore.initializeAuth();
    }
  }

  return { isLoading, updatePassword, fetchProfile };
});
