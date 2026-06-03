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
          <input id="name" class="form-input w-full bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed" type="text" v-model="formData.name" disabled readonly />
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
          <div class="flex justify-between items-end mb-1">
            <label class="block text-sm font-medium" for="phone">
              Nomor Telepon
            </label>
            <div v-if="user.whatsappJid" class="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded flex items-center">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              Terverifikasi (Bot Connected)
            </div>
            <div v-else-if="botPhoneNumber" class="text-xs">
              <a :href="waLink" target="_blank" class="text-violet-600 hover:text-violet-700 font-medium flex items-center">
                Tautkan ke Bot WhatsApp &rarr;
              </a>
            </div>
          </div>
          <input id="phone" class="form-input w-full" type="text" v-model="formData.phoneNumber"
            placeholder="Cth: 628123456789" />

          <div v-if="phoneError" class="text-sm text-red-500 mt-1">
            {{ phoneError }}
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <button type="submit" :disabled="profileStore.isUpdatingProfile || !isDirty"
          class="px-4 py-2 text-sm font-medium text-white bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
          {{
            profileStore.isUpdatingProfile ? "Menyimpan..." : "Simpan Perubahan"
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useProfileStore } from "../../../profile/presentation/stores/useProfileStore";
import UserAvatar from "@/images/user-avatar-32.png";

const props = defineProps({
  user: Object,
});

const profileStore = useProfileStore();
const formData = ref({});
const originalData = ref({});
const fileInput = ref(null);
const phoneError = ref(null);
const botPhoneNumber = ref(null);

const userPhoto = computed(() => {
  return props.user?.avatarUrl || UserAvatar;
});

const isDirty = computed(() => {
  return (
    formData.value.displayName !== originalData.value.displayName ||
    formData.value.phoneNumber !== originalData.value.phoneNumber
  );
});

const waLink = computed(() => {
  if (!botPhoneNumber.value || !props.user?.invitationCode) return "#";
  return `https://wa.me/${botPhoneNumber.value}?text=!link%20${props.user.invitationCode}`;
});

onMounted(async () => {
  try {
    // URL Backend Kainest (disesuaikan dengan env atau default localhost:3000)
    const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${backendUrl}/wabot/info`);
    const data = await res.json();
    if (data.success) {
      botPhoneNumber.value = data.botPhoneNumber;
    }
  } catch (error) {
    console.error("Gagal memuat nomor bot WhatsApp:", error);
  }
});

watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      const data = {
        name: newUser.name,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        displayName: newUser.displayName,
      };
      formData.value = { ...data };
      originalData.value = { ...data };
    }
  },
  { immediate: true, deep: true }
);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    await profileStore.uploadNewAvatar(file);
  } catch (error) {
    console.error("Avatar upload failed:", error.message);
  } finally {
    event.target.value = null;
  }
};

const handleSubmit = async () => {
  phoneError.value = null;

  let phoneNumber = formData.value.phoneNumber ? formData.value.phoneNumber.trim() : '';

  if (phoneNumber) {
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '62' + phoneNumber.substring(1);
    }
    if (phoneNumber.startsWith('+62')) {
      phoneNumber = phoneNumber.substring(1);
    }
    formData.value.phoneNumber = phoneNumber;

    const phoneRegex = /^62\d{9,13}$/;
    if (!phoneRegex.test(phoneNumber)) {
      phoneError.value = "Format No. HP salah. Harus diawali 62 (Cth: 628123456789).";
      return; 
    }
  }

  try {
    await profileStore.updateUserProfile(formData.value);
    // Update original data setelah sukses save agar tombol disabled lagi
    originalData.value = { ...formData.value };
  } catch (error) {
    console.error("Profile update failed:", error.message);
  }
};
</script>