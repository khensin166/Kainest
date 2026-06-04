<!-- EditProfileForm   -->
<template>
  <div>
    <h2 class="text-xl text-gray-800 dark:text-gray-100 font-bold">
      Edit Profil
    </h2>
    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
      Perbarui nama panggilan, sesuaikan preferensi, dan atur informasi pribadi Anda.
    </p>
    <div v-if="!user" class="text-center">Memuat data profil...</div>
    <form v-else @submit.prevent="handleSubmit">
      <div class="flex items-center space-x-4 mb-6">
        <img class="w-20 h-20 rounded-full object-cover" :src="userPhoto" alt="User" referrerpolicy="no-referrer" />
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
          <label class="block text-sm font-medium mb-1" for="name">Nama Lengkap</label>
          <input id="name" class="form-input w-full bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
            type="text" v-model="formData.name" disabled readonly />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1" for="displayName">Nama Panggilan</label>
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
            <!-- Status: Sudah Terverifikasi -->
            <div v-if="user.whatsappJid"
              class="text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-1 rounded flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Terverifikasi (Bot Connected)
            </div>
            <!-- Status: Belum Terverifikasi - Tombol Buka Panduan -->
            <div v-else class="text-xs">
              <button type="button" @click="showWaModal = true"
                class="text-violet-600 hover:text-violet-700 font-medium flex items-center gap-1 transition-colors">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Tautkan ke Bot WhatsApp →
              </button>
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

    <BaseModal :isOpen="showWaModal" size="md" @close="showWaModal = false" :hideFooter="true">
      <template #header>
        <div class="flex items-center gap-3 w-full">
          <div
            class="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100">Tautkan WhatsApp Bot</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 font-normal">Ikuti langkah di bawah ini</p>
          </div>
        </div>
      </template>

      <template #body>
        <div class="space-y-4 pt-2 pb-2">
          <!-- Langkah 1: Salin kode !link -->
          <div
            class="flex gap-3 p-3 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-800 text-left">
            <div
              class="w-7 h-7 rounded-full bg-violet-600 text-white font-bold text-sm flex-shrink-0 flex items-center justify-center">
              1</div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">Salin kode unik ini</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Kamu akan mengirimkan kode ini ke chat
                <strong>personal</strong> bot nanti</p>
              <div class="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2">
                <code class="text-green-400 text-xs font-mono flex-1">!link {{ user.invitationCode }}</code>
                <button @click="copyLinkCode" type="button"
                  class="text-gray-400 hover:text-white transition-colors flex-shrink-0">
                  <svg v-if="!copiedCode" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Langkah 2: Buka WA Bot Personal & Kirim Kode -->
          <div class="flex gap-3 text-left">
            <div
              class="w-7 h-7 rounded-full bg-green-600 text-white font-bold text-sm flex-shrink-0 flex items-center justify-center mt-0.5">
              2</div>
            <div>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">Kirim kode ke chat <span
                  class="text-green-600 dark:text-green-400">personal</span> bot</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Tautkan akunmu secara privat agar kode tidak
                bocor ke grup.</p>
              <div v-if="botPhoneNumber" class="flex flex-wrap gap-2">
                <a :href="`https://wa.me/${botPhoneNumber}`" target="_blank"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg font-medium transition-colors">
                  <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Buka WhatsApp Bot
                </a>
                <button @click="copyBotNumber" type="button"
                  class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs rounded-lg font-medium transition-colors border border-gray-300 dark:border-gray-600">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  {{ copiedBotNum ? 'Tersalin!' : 'Salin Nomor' }}
                </button>
              </div>
              <p v-else class="text-xs text-amber-600 dark:text-amber-400">⚠️ Nomor bot belum tersedia. Pastikan bot
                sedang aktif.</p>
            </div>
          </div>

          <!-- Langkah 3: Setelah Sukses, Buat Grup -->
          <div class="flex gap-3 text-left">
            <div
              class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0 flex items-center justify-center mt-0.5">
              3</div>
            <div>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">Setelah sukses terhubung, buat grup baru
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Bot akan otomatis menyapa saat pertama kali
                masuk grup!</p>
              <div class="mt-1.5 space-y-1.5">
                <div class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span class="text-base leading-none">🤖</span>
                  <p><span class="font-medium text-gray-700 dark:text-gray-300">Android:</span> Di chat bot, ketuk titik
                    tiga (⋮) → pilih <em>New Group</em></p>
                </div>
                <div class="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span class="text-base leading-none">🍎</span>
                  <p><span class="font-medium text-gray-700 dark:text-gray-300">iPhone:</span> Ketuk nama profil bot →
                    pilih <em>Create Group with...</em></p>
                </div>
              </div>
            </div>
          </div>

          <!-- Langkah 4: !aktifkan-kainest -->
          <div
            class="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-left">
            <div
              class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-sm flex-shrink-0 flex items-center justify-center">
              4</div>
            <div>
              <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">Aktifkan grup sebagai tempat
                bertransaksi</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mb-1.5">Balas sapaan bot di grup dengan perintah ini:
              </p>
              <code
                class="bg-gray-900 text-green-400 text-xs font-mono px-3 py-1.5 rounded-lg inline-block">!aktifkan-kainest</code>
            </div>
          </div>

          <button @click="showWaModal = false"
            class="w-full mt-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors">
            Tutup
          </button>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useProfileStore } from "../../../profile/presentation/stores/useProfileStore";
import BaseModal from "../../../../components/modals/BaseModal.vue";
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
const showWaModal = ref(false);
const copiedCode = ref(false);
const copiedBotNum = ref(false);

const userPhoto = computed(() => {
  return props.user?.avatarUrl || UserAvatar;
});

const isDirty = computed(() => {
  return (
    formData.value.displayName !== originalData.value.displayName ||
    formData.value.phoneNumber !== originalData.value.phoneNumber
  );
});

// Salin kode !link
const copyLinkCode = async () => {
  await navigator.clipboard.writeText(`!link ${props.user?.invitationCode}`);
  copiedCode.value = true;
  setTimeout(() => { copiedCode.value = false; }, 2500);
};

// Salin nomor bot
const copyBotNumber = async () => {
  await navigator.clipboard.writeText(botPhoneNumber.value);
  copiedBotNum.value = true;
  setTimeout(() => { copiedBotNum.value = false; }, 2500);
};

onMounted(async () => {
  try {
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
    originalData.value = { ...formData.value };
  } catch (error) {
    console.error("Profile update failed:", error.message);
  }
};
</script>