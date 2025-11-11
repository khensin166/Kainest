import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { SecurityRepository } from "../../data/repository/SecurityRepository";
import { ChangePasswordUseCase } from "../../domain/use-case/ChangePasswordUseCase";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";
import { IncorrectPasswordFailure } from "../../../../core/error/failure";

export const useSecurityStore = defineStore("security", () => {
  // State-nya hanya peduli pada loading ganti password
  const isLoading = ref(false); 
  const modalStore = useModalStore();

  // Menggunakan Repository dan UseCase dari fitur 'security'
  const repository = new SecurityRepository();
  const changePasswordUseCase = new ChangePasswordUseCase(repository);

  /**
   * Aksi untuk mengganti password
   */
  async function updatePassword(passwords) {
    isLoading.value = true;
    const result = await changePasswordUseCase.execute(passwords);
    isLoading.value = false;

    if (result.left) {
      // Gagal
      const failure = result.left;
      let message =
        failure instanceof IncorrectPasswordFailure
          ? failure.message
          : mapFailureToMessage(failure);

      modalStore.openModal({
        newTitle: "Gagal Mengubah Password",
        newMessage: message,
        newStatus: "error",
      });
      throw new Error(message);
    } else {
      // Sukses
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Password Anda telah berhasil diperbarui.",
        newStatus: "success",
      });
    }
  }

  return {
    isLoading,
    updatePassword,
  };
});