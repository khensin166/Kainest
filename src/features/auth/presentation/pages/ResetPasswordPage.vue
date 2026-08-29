<template>
  <main class="h-[100dvh] flex flex-col lg:flex-row bg-surface-page font-sans relative overflow-hidden">
    
    <!-- Theme Toggle -->
    <div class="absolute top-6 right-6 z-50">
      <ThemeToggle />
    </div>

    <!-- Bagian Kiri (Desktop) & Atas (Mobile): Ilustrasi / Branding -->
    <div class="w-full lg:w-1/2 bg-surface-brand relative flex flex-col justify-center px-6 pt-6 pb-8 lg:px-16 lg:py-0 h-[30dvh] lg:h-screen z-0">

      <div class="relative z-10 flex flex-col justify-center h-full">
        <!-- Desktop Logo -->
        <div class="hidden lg:flex items-center gap-3 mb-12">
          <img class="h-10 w-auto filter drop-shadow-lg" src="/images/logo.png" alt="Logo Aplikasi" />
          <span class="text-white text-2xl font-bold tracking-tight">Kainest</span>
        </div>

        <!-- Mobile Header -->
        <div class="lg:hidden flex flex-col gap-3 w-full mt-6">
          <h1 class="text-2xl font-bold text-white mb-1 leading-tight">
            Buat Sandi Baru
          </h1>
          <p class="text-white/70 text-xs font-light leading-relaxed pr-2">
            Silakan masukkan kata sandi baru Anda untuk akun Kainest.
          </p>
        </div>

        <!-- Desktop Typography -->
        <div class="hidden lg:block">
          <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Amankan.<br />
            <span class="text-brand-muted">Akun Anda.</span>
          </h1>
          <p class="text-white/70 text-lg max-w-md font-light leading-relaxed">
            Buat kata sandi baru yang kuat agar data keuangan dan catatan aktivitas Anda tetap aman.
          </p>
        </div>
      </div>
      
    </div>

    <!-- Bagian Kanan (Desktop) & Bawah (Mobile): Form -->
    <div class="w-full lg:w-1/2 flex-1 flex flex-col justify-start lg:justify-center items-center relative z-10 lg:z-auto bg-surface-page lg:bg-transparent rounded-t-lg lg:rounded-none px-6 py-6 lg:p-12 mt-[-1.5rem] lg:mt-0 overflow-y-auto">
      
      <div class="w-full max-w-md space-y-6">
        <!-- Desktop Header Title -->
        <div class="hidden lg:block text-left mb-6">
          <h2 class="text-2xl font-bold text-text-primary tracking-tight tracking-tight">Buat Sandi Baru</h2>
          <p class="mt-2 text-sm text-text-secondary">
            Masukkan kata sandi baru Anda di bawah ini.
          </p>
        </div>

        <form @submit.prevent="handleResetPassword" class="mt-6 space-y-4">
          <div class="space-y-3">
            <!-- Input Password -->
            <div class="relative">
              <label for="password" class="sr-only">Sandi Baru</label>
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconLock class="h-5 w-5 text-text-muted" />
              </div>
              <input id="password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password" required
                class="block w-full pl-11 pr-12 py-3 bg-surface-input border border-border-default rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                placeholder="Sandi Baru (Min. 6 karakter)" />
              <button type="button" @click="showPassword = !showPassword" v-show="password.length > 0"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary focus:outline-none">
                <IconEye v-if="!showPassword" class="h-5 w-5" />
                <IconEyeOff v-else class="h-5 w-5" />
              </button>
            </div>

            <!-- Input Confirm Password -->
            <div class="relative">
              <label for="confirm-password" class="sr-only">Konfirmasi Sandi Baru</label>
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconLock class="h-5 w-5 text-text-muted" />
              </div>
              <input id="confirm-password" v-model="confirmPassword" name="confirmPassword" :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password" required
                class="block w-full pl-11 pr-12 py-3 bg-surface-input border border-border-default rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                placeholder="Ulangi Sandi Baru" />
            </div>
          </div>

          <!-- Pesan Error Lokal -->
          <div v-if="localError" class="mt-4 p-3 bg-status-danger-bg border border-status-danger/30 rounded-md text-sm text-status-danger text-center">
            {{ localError }}
          </div>

          <!-- Tombol Submit -->
          <button type="submit" :disabled="authStore.isLoading || !isValid"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-md text-sm font-bold text-text-inverse bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4">
            {{ authStore.isLoading ? "Memproses..." : "Simpan Sandi Baru" }}
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { IconEye, IconEyeOff, IconLock } from '@/ui/icons';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import ThemeToggle from '@/components/ThemeToggle.vue';

const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const localError = ref('');
const token = ref('');

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onMounted(() => {
  if (route.query.token) {
    token.value = route.query.token;
  } else {
    localError.value = "Token reset kata sandi tidak ditemukan atau tidak valid.";
  }
});

const isValid = computed(() => {
  return password.value.length >= 6 && password.value === confirmPassword.value && token.value;
});

const handleResetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    localError.value = "Konfirmasi kata sandi tidak cocok.";
    return;
  }
  
  if (!token.value) {
    localError.value = "Token reset kata sandi tidak ditemukan atau tidak valid.";
    return;
  }

  localError.value = '';
  
  try {
    await authStore.resetPassword(password.value, token.value);
    router.push('/login');
  } catch (error) {
    console.error("Reset password failed:", error);
  }
};
</script>
