// src/features/security/presentation/stores/useSecurityStore.js
import { defineStore } from "pinia";
import { notify } from "@/lib/notify";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { changePasswordUseCase } from "../../../../core/di/di";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";
import { IncorrectPasswordFailure } from "../../../../core/error/failure";

export const useSecurityStore = defineStore("security", () => {
  // State-nya hanya peduli pada loading ganti password
  const isLoading = ref(false); 
  const modalStore = useModalStore();

  // Menggunakan UseCase yang di-inject
  const changePasswordUseCaseInstance = changePasswordUseCase;

  /**
   * Aksi untuk mengganti password
   */
  async function updatePassword(passwords) {
    isLoading.value = true;
    const result = await changePasswordUseCaseInstance.execute(passwords);
    isLoading.value = false;

    if (result.left) {
      // Gagal
      const failure = result.left;
      let message =
        failure instanceof IncorrectPasswordFailure
          ? failure.message
          : mapFailureToMessage(failure);

      notify.error(message);
      throw new Error(message);
    } else {
      // Sukses
      notify.success("Password Anda telah berhasil diperbarui.");
    }
  }

  return {
    isLoading,
    updatePassword,
  };
});