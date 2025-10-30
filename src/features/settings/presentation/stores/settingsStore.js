// src\features\settings\presentation\stores\settingsStore.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { useModalStore } from "../../../../stores/modalStore";
import { useAuthStore } from "../../../auth/presentation/stores/authStore";
import { SettingsRepository } from "../../data/repository/SettingsRepository";
import { ChangePasswordUseCase } from "../../domain/use-cases/ChangePasswordUseCase";
import { mapFailureToMessage } from "../../../../core/error/map_failure_to_message";
import { IncorrectPasswordFailure } from "../../../../core/error/failure";
import { UpdateProfileUseCase } from "../../domain/use-cases/UpdateProfileUseCase.js";
import { UploadAvatarUseCase } from "../../domain/use-cases/UploadAvatarUseCase.js";
import { GetProfileUseCase } from "../../domain/use-cases/GetProfileUseCase.js";

export const useSettingsStore = defineStore("settings", () => {
  const isLoading = ref(false);
  const isUpdatingProfile = ref(false); // State loading terpisah
  const isUploadingPhoto = ref(false); // State loading terpisah

  const modalStore = useModalStore();
  const authStore = useAuthStore();

  const repository = new SettingsRepository();
  const changePasswordUseCase = new ChangePasswordUseCase(repository);
  const updateProfileUseCase = new UpdateProfileUseCase(repository);
  const uploadAvatarUseCase = new UploadAvatarUseCase(repository);
  const getProfileUseCase = new GetProfileUseCase(repository);

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

  async function updateUserProfile(profileData) {
    isUpdatingProfile.value = true;
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
      authStore.setUser(result.right); // Asumsi authStore punya action setUser
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Profil Anda telah diperbarui.",
        newStatus: "success",
      });
    }
  }

  // --- 4. FUNGSI BARU: Upload Avatar ---
  async function uploadNewAvatar(file) {
    isUploadingPhoto.value = true;
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
      authStore.setUser(result.right); // Asumsi authStore punya action setUser
      modalStore.openModal({
        newTitle: "Berhasil",
        newMessage: "Foto profil telah diperbarui.",
        newStatus: "success",
      });
    }
  }

  // Fungsi untuk mengambil profil user dari authStore
  async function fetchProfile() {
    // JANGAN panggil authStore.initializeAuth()
    console.log("Memanggil settingsStore.fetchProfile() untuk data lengkap...");
    isLoading.value = true; // Gunakan state loading dari settingsStore
    
    const result = await getProfileUseCase.execute();
    
    isLoading.value = false;

    if (result.right) {
      // Sukses! Simpan data lengkap ke authStore
      // 'result.right' adalah data 'profile' lengkap
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

  return { isLoading, isUpdatingProfile,
    isUploadingPhoto, updatePassword, fetchProfile, updateUserProfile, 
    uploadNewAvatar, };
});
