import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { useAuthStore } from "../../../auth/presentation/stores/authStore";
import { ProfileRepository } from "../../data/repository/ProfileRepository";
import { GetProfileUseCase } from "../../domain/use-case/GetProfileUseCase";
import { UpdateProfileUseCase } from "../../domain/use-case/UpdateProfileUseCase";
import { UploadAvatarUseCase } from "../../domain/use-case/UploadAvatarUseCase";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";

export const useProfileStore = defineStore("profile", () => {
  // State terpisah untuk setiap aksi
  const isLoading = ref(false); // Untuk fetchProfile
  const isUpdatingProfile = ref(false); // Untuk update data teks
  const isUploadingPhoto = ref(false); // Untuk upload foto

  const modalStore = useModalStore();
  const authStore = useAuthStore(); // Dibutuhkan untuk update data user global

  // Menggunakan Repository dan UseCase dari fitur 'profile'
  const repository = new ProfileRepository();
  const getProfileUseCase = new GetProfileUseCase(repository);
  const updateProfileUseCase = new UpdateProfileUseCase(repository);
  const uploadAvatarUseCase = new UploadAvatarUseCase(repository);

  /**
   * Aksi untuk mengambil data profil lengkap
   */
  async function fetchProfile() {
    console.log("Memanggil profileStore.fetchProfile() untuk data lengkap...");
    isLoading.value = true;
    
    const result = await getProfileUseCase.execute();
    
    isLoading.value = false;

    if (result.right) {
      // Sukses! Simpan data (ProfileEntity) ke authStore
      authStore.setUser(result.right); 
    } else {
      // Gagal
      const message = mapFailureToMessage(result.left);
      modalStore.openModal({
        newTitle: "Gagal Memuat Profil",
        newMessage: message,
        newStatus: "error",
      });
    }
  }

  /**
   * Aksi untuk update data teks (nama, hp, dll)
   */
  async function updateUserProfile(profileData) {
    isUpdatingProfile.value = true;
    
    // profileData sudah dalam camelCase, misal: { displayName, phoneNumber }
    // Mapper di repository akan mengubahnya ke snake_case
    const result = await updateProfileUseCase.execute(profileData);
    isUpdatingProfile.value = false;

    if (result.left) {
      const message = mapFailureToMessage(result.left);
      modalStore.openModal({
        newTitle: "Gagal Update Profil",
        newMessage: message,
        newStatus: "error",
      });
      throw new Error(message);
    } else {
      // BERHASIL! Update data user di authStore
      authStore.setUser(result.right); // result.right adalah ProfileEntity baru
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Profil Anda telah diperbarui.",
        newStatus: "success",
      });
    }
  }

  /**
   * Aksi untuk upload foto profil baru
   */
  async function uploadNewAvatar(file) {
    isUploadingPhoto.value = true;
    
    // Use case ini sudah menangani alur: upload -> dapat URL -> simpan URL
    const result = await uploadAvatarUseCase.execute(file);
    isUploadingPhoto.value = false;

    if (result.left) {
      const message = mapFailureToMessage(result.left);
      modalStore.openModal({
        newTitle: "Gagal Upload Foto",
        newMessage: message,
        newStatus: "error",
      });
      throw new Error(message);
    } else {
      // BERHASIL! Update data user di authStore
      authStore.setUser(result.right); // result.right adalah ProfileEntity baru
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Foto profil telah diperbarui.",
        newStatus: "success",
      });
    }
  }

  return {
    isLoading,
    isUpdatingProfile,
    isUploadingPhoto,
    fetchProfile,
    updateUserProfile,
    uploadNewAvatar,
  };
});