// src/features/couple/presentation/stores/useCoupleStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { 
  getCoupleStatusUseCase, 
  connectCoupleUseCase 
} from "../../../../core/di/di";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";

export const useCoupleStore = defineStore("couple", () => {
  const connectionStatus = ref(null); // Akan berisi CoupleEntity
  const isLoading = ref(false);
  
  const modalStore = useModalStore();
  
  // === USE CASES (Injected) ===
  const getCoupleStatusUseCaseInstance = getCoupleStatusUseCase;
  const connectCoupleUseCaseInstance = connectCoupleUseCase;

  /**
   * Mengambil status koneksi saat ini
   */
  async function fetchCoupleStatus() {
    isLoading.value = true;
    const result = await getCoupleStatusUseCaseInstance.execute();
    isLoading.value = false;

    if (result.right) {
      connectionStatus.value = result.right; // Simpan CoupleEntity
    } else {
      modalStore.openModal({
        newTitle: "Error",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
    }
  }

  /**
   * Mencoba terhubung dengan pasangan menggunakan kode
   */
  async function connectToPartner(invitationCode) {
    isLoading.value = true;
    const result = await connectCoupleUseCaseInstance.execute(invitationCode);
    isLoading.value = false;

    if (result.right) {
      // Sukses! 'result.right' adalah CoupleEntity baru dari getCoupleStatus
      connectionStatus.value = result.right;
      modalStore.openModal({
        newTitle: "Berhasil!",
        newMessage: "Anda sekarang terhubung dengan pasangan Anda.",
        newStatus: "success",
      });
    } else {
      // Gagal
      modalStore.openModal({
        newTitle: "Gagal Terhubung",
        newMessage: mapFailureToMessage(result.left),
        newStatus: "error",
      });
      throw new Error(mapFailureToMessage(result.left));
    }
  }

  return {
    connectionStatus,
    isLoading,
    fetchCoupleStatus,
    connectToPartner,
  };
});