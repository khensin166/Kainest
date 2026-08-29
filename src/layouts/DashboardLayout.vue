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
          <h2 class="text-xl font-bold text-text-primary mb-1">Selamat Datang di Kainest! 🎉</h2>
          <p class="text-sm text-text-muted font-normal">Selamat datang di aplikasi pembantu Anda.
            Lengkapi profil Anda untuk mulai.</p>
        </div>
      </template>

      <template #body>
        <form @submit.prevent="submitOnboarding" class="mt-4 space-y-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-text-primary" for="displayName">
              Nama Panggilan <span class="text-status-danger">*</span>
            </label>
            <p class="text-xs text-text-muted mb-2">Silakan isi nama panggilan agar kami mudah
              memanggil Anda.</p>
            <input id="displayName" class="form-input w-full" type="text" v-model="onboardingData.displayName"
              placeholder="Cth: Kenan" required />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-text-primary" for="phone">
              Nomor Telepon <span class="text-status-danger">*</span>
            </label>

            <!-- WhatsApp Bot Info Block -->
            <div
              class="bg-brand-light border border-brand-soft rounded-lg p-3 my-2 flex items-start gap-2.5">
              <div
                class="w-6 h-6 rounded-full bg-brand-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                <IconInfo class="w-3.5 h-3.5 text-brand-primary" aria-hidden="true" />
              </div>
              <p class="text-xs text-text-primary leading-relaxed">
                <strong class="font-semibold block mb-0.5">Kenapa butuh nomor telepon?</strong>
                Nomor ini akan digunakan sebagai validasi agar Anda bisa terhubung dengan <strong>WhatsApp Bot
                  Kainest</strong>. Bot ini akan sangat membantu mempermudah kegiatan pencatatan harian Anda (seperti
                mencatat pengeluaran) langsung dari chat WhatsApp.
              </p>
            </div>

            <input id="phone" class="form-input w-full" type="text" v-model="onboardingData.phoneNumber"
              placeholder="Cth: 628123456789" required />
            <div v-if="phoneError" class="text-xs text-status-danger mt-1">{{ phoneError }}</div>
          </div>

          <div class="pt-4">
            <button type="submit" :disabled="profileStore.isUpdatingProfile"
              class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md text-sm font-medium text-text-inverse bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50">
              {{ profileStore.isUpdatingProfile ? "Menyimpan..." : "Lanjutkan ke Aplikasi" }}
            </button>
          </div>
        </form>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { IconInfo } from '@/ui/icons';
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