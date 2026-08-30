<template>
  <main class="h-[100dvh] flex flex-col lg:flex-row bg-surface-page font-sans relative overflow-hidden">
    
    <!-- Theme Toggle -->
    <div class="absolute top-6 right-6 z-50">
      <ThemeToggle />
    </div>

    <!-- Bagian Kiri (Desktop) & Atas (Mobile): Ilustrasi / Branding -->
    <div class="w-full lg:w-1/2 bg-surface-brand relative flex flex-col justify-center px-6 pt-6 pb-8 lg:px-16 lg:py-0 h-[30dvh] lg:h-screen z-0">

      <!-- Mobile Back Button (Absolute) -->
      <button @click="$router.push('/login')" class="lg:hidden absolute top-6 left-6 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md z-20">
        <IconArrowLeft class="w-4 h-4" aria-hidden="true" />
      </button>

      <div class="relative z-10 flex flex-col justify-center h-full">
        <!-- Desktop Logo -->
        <div class="hidden lg:flex items-center gap-3 mb-12">
          <img class="h-10 w-auto filter drop-shadow-lg" src="/images/logo.png" alt="Logo Aplikasi" />
          <span class="text-white text-2xl font-bold tracking-tight">Kainest</span>
        </div>

        <!-- Mobile Header -->
        <div class="lg:hidden flex flex-col gap-3 w-full mt-6">
          <h1 class="text-2xl font-bold text-white mb-1 leading-tight">
            Lupa Kata Sandi?
          </h1>
          <p class="text-white/70 text-xs font-light leading-relaxed pr-2">
            Kami akan mengirimkan tautan reset kata sandi ke email Anda.
          </p>
        </div>

        <!-- Desktop Typography -->
        <div class="hidden lg:block">
          <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Kembali ke.<br />
            <span class="text-brand-muted">Aktivitas Anda.</span>
          </h1>
          <p class="text-white/70 text-lg max-w-md font-light leading-relaxed">
            Jangan khawatir jika Anda melupakan kata sandi Anda. Masukkan email yang terdaftar, dan kami akan membantu Anda kembali ke Kainest.
          </p>
        </div>
      </div>
      
    </div>

    <!-- Bagian Kanan (Desktop) & Bawah (Mobile): Form -->
    <div class="w-full lg:w-1/2 flex-1 flex flex-col justify-start lg:justify-center items-center relative z-10 lg:z-auto bg-surface-page lg:bg-transparent rounded-t-lg lg:rounded-none px-6 py-6 lg:p-12 mt-[-1.5rem] lg:mt-0 overflow-y-auto">
      
      <div class="w-full max-w-md space-y-6">
        <!-- Desktop Header Title -->
        <div class="hidden lg:block text-left mb-6">
          <h2 class="text-2xl font-bold text-text-primary tracking-tight tracking-tight">Lupa Kata Sandi?</h2>
          <p class="mt-2 text-sm text-text-secondary">
            Masukkan email yang terdaftar. Kami akan mengirimkan tautan untuk mengatur ulang kata sandi Anda.
          </p>
        </div>

        <form @submit.prevent="handleForgotPassword" class="mt-6 space-y-4">
          <div class="space-y-3">
            <!-- Input Email -->
            <div class="relative">
              <label for="email-address" class="sr-only">Alamat Email</label>
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconMail class="h-5 w-5 text-text-muted" />
              </div>
              <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required
                class="block w-full pl-11 pr-4 py-3 bg-surface-input border border-border-default rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                placeholder="Email Address" />
            </div>
          </div>

          <!-- Tombol Submit -->
          <button type="submit" :disabled="authStore.isLoading || !email"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-md text-sm font-bold text-text-inverse bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4">
            {{ authStore.isLoading ? "Mengirim Tautan..." : "Kirim Tautan Reset" }}
          </button>

          <!-- Back to login link -->
          <p class="mt-8 text-center text-sm text-text-secondary flex items-center justify-center cursor-pointer hover:text-brand-primary transition-colors" @click="$router.push('/login')">
             <IconArrowLeft class="h-4 w-4 mr-1" />
             Kembali ke Login
          </p>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { IconArrowLeft, IconMail } from '@/ui/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import ThemeToggle from '@/components/ThemeToggle.vue';

const email = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleForgotPassword = async () => {
  try {
    await authStore.forgotPassword(email.value);
    email.value = '';
  } catch (error) {
    console.error("Forgot password failed:", error);
  }
};
</script>
