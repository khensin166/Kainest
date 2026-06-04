<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <router-view />
      </main>

    </div>

    <!-- Onboarding Modal untuk User Baru -->
    <BaseModal :isOpen="showOnboarding" size="md" :hideFooter="true" @close="preventClose">
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">Selamat Datang di Kainest! 🎉</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 font-normal">Selamat datang di aplikasi pembantu Anda.
            Lengkapi profil Anda untuk mulai.</p>
        </div>
      </template>

      <template #body>
        <form @submit.prevent="submitOnboarding" class="mt-4 space-y-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="displayName">
              Nama Panggilan <span class="text-red-500">*</span>
            </label>
            <p class="text-xs text-gray-500 dark:text-gray-400 mb-2">Silakan isi nama panggilan agar kami mudah
              memanggil Anda.</p>
            <input id="displayName" class="form-input w-full" type="text" v-model="onboardingData.displayName"
              placeholder="Cth: Kenan" required />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300" for="phone">
              Nomor Telepon <span class="text-red-500">*</span>
            </label>

            <!-- WhatsApp Bot Info Block -->
            <div
              class="bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 rounded-lg p-3 my-2 flex items-start gap-2.5">
              <div
                class="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg class="w-3.5 h-3.5 text-violet-600 dark:text-violet-300" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p class="text-xs text-violet-800 dark:text-violet-200 leading-relaxed">
                <strong class="font-semibold block mb-0.5">Kenapa butuh nomor telepon?</strong>
                Nomor ini akan digunakan sebagai validasi agar Anda bisa terhubung dengan <strong>WhatsApp Bot
                  Kainest</strong>. Bot ini akan sangat membantu mempermudah kegiatan pencatatan harian Anda (seperti
                mencatat pengeluaran) langsung dari chat WhatsApp.
              </p>
            </div>

            <input id="phone" class="form-input w-full" type="text" v-model="onboardingData.phoneNumber"
              placeholder="Cth: 628123456789" required />
            <div v-if="phoneError" class="text-xs text-red-500 mt-1">{{ phoneError }}</div>
          </div>

          <div class="pt-4">
            <button type="submit" :disabled="profileStore.isUpdatingProfile"
              class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50">
              {{ profileStore.isUpdatingProfile ? "Menyimpan..." : "Lanjutkan ke Aplikasi" }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import Sidebar from '../partials/Sidebar.vue';
import Header from '../partials/Header.vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { useProfileStore } from '@/features/profile/presentation/stores/useProfileStore';

const sidebarOpen = ref(false);
const authStore = useAuthStore();
const profileStore = useProfileStore();

const showOnboarding = ref(false);
const phoneError = ref(null);
const onboardingData = ref({
  displayName: '',
  phoneNumber: ''
});

// Cek apakah user butuh onboarding (tidak punya displayName)
const checkOnboarding = () => {
  if (authStore.user && (!authStore.user.displayName || authStore.user.displayName.trim() === '')) {
    // Jika name ada (dari social login), pakai sebagai default
    onboardingData.value.displayName = authStore.user.name || '';
    showOnboarding.value = true;
  } else {
    showOnboarding.value = false;
  }
};

onMounted(() => {
  checkOnboarding();
});

// Pantau perubahan user (berjaga-jaga jika authStore baru dimuat)
watch(() => authStore.user, () => {
  checkOnboarding();
});

// Mencegah modal ditutup dengan klik luar
const preventClose = () => {
  // Modal ini wajib diisi, jadi tidak boleh ditutup
};

const submitOnboarding = async () => {
  phoneError.value = null;
  let phoneNumber = onboardingData.value.phoneNumber ? onboardingData.value.phoneNumber.trim() : '';

  if (!phoneNumber) {
    phoneError.value = "Nomor telepon wajib diisi.";
    return;
  }

  if (phoneNumber.startsWith('0')) phoneNumber = '62' + phoneNumber.substring(1);
  if (phoneNumber.startsWith('+62')) phoneNumber = phoneNumber.substring(1);

  const phoneRegex = /^62\d{9,13}$/;
  if (!phoneRegex.test(phoneNumber)) {
    phoneError.value = "Format No. HP salah. Harus diawali 62 (Cth: 628123456789).";
    return;
  }

  try {
    await profileStore.updateUserProfile({
      ...authStore.user,
      displayName: onboardingData.value.displayName,
      phoneNumber: phoneNumber
    });
    // Modal otomatis tertutup karena watch(authStore.user) akan mendeteksi displayName sudah terisi
  } catch (error) {
    console.error("Gagal menyimpan data onboarding:", error);
  }
};
</script>