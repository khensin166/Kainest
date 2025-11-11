<!-- EditProfileForm   -->
<template>
  <div>
    <h2 class="text-xl text-gray-800 dark:text-gray-100 font-bold mb-6">
      Edit Profil
    </h2>
    <div v-if="!user" class="text-center">Memuat data profil...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div class="flex items-center space-x-4 mb-6">
        <img class="w-20 h-20 rounded-full object-cover" :src="userPhoto" alt="User" />
        <div>
          <button type="button" @click="triggerFileInput" :disabled="profileStore.isUploadingPhoto"
            class="px-3 py-2 text-sm font-medium text-violet-600 border border-violet-300 rounded-md disabled:opacity-50">
            {{
              profileStore.isUploadingPhoto ? "Mengunggah..." : "Ubah Foto"
            }}
          </button>
          <input type="file" ref="fileInput" @change="handleFileChange" accept="image/png, image/jpeg" hidden />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium mb-1" for="name">Nama Lengkap (dari User)</label>
          <input id="name" class="form-input w-full" type="text" v-model="formData.name" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="displayName">Nama Panggilan (dari UserProfile)</label>
          <input id="displayName" class="form-input w-full" type="text" v-model="formData.displayName" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="email">Email</label>
          <input id="email" class="form-input w-full disabled:bg-gray-100 dark:disabled:bg-gray-700" type="email"
            v-model="formData.email" disabled />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="phone">Nomor Telepon</label>
          <input id="phone" class="form-input w-full" type="text" v-model="formData.phoneNumber"
            placeholder="Belum diisi" />
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button type="submit" :disabled="profileStore.isUpdatingProfile"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] rounded-md disabled:bg-gray-400">
          {{
            profileStore.isUpdatingProfile ? "Menyimpan..." : "Simpan Perubahan"
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useProfileStore } from "../../../profile/presentation/stores/useProfileStore";
import UserAvatar from "@/images/user-avatar-32.png";

const props = defineProps({
  user: Object,
});

const profileStore = useProfileStore();
const formData = ref({});
const fileInput = ref(null); // Ref untuk input file

const userPhoto = computed(() => {
  // Gunakan 'avatarUrl' yang sudah di-flatten dari Entity
  return props.user?.avatarUrl || UserAvatar;
});

// Salin data dari props ke state lokal
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      // Gabungkan data dari User dan UserProfile
      formData.value = {
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        displayName: newUser.displayName,
      };
    }
  },
  { immediate: true, deep: true }
);

// --- FUNGSI BARU ---

// Fungsi untuk memicu klik pada input file
const triggerFileInput = () => {
  fileInput.value.click();
};

// Fungsi yang menangani saat file dipilih
const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    await profileStore.uploadNewAvatar(file);
    // UI akan update otomatis karena authStore.user berubah
  } catch (error) {
    console.error("Avatar upload failed:", error.message);
  } finally {
    // Reset input file agar bisa pilih file yang sama lagi
    event.target.value = null;
  }
};

// Fungsi yang menangani submit form (data teks)
const handleSubmit = async () => {
  try {
    await profileStore.updateUserProfile(formData.value);
  } catch (error) {
    console.error("Profile update failed:", error.message);
  }
};
</script>