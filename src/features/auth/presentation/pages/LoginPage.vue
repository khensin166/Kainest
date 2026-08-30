<!--features\auth\presentation\pages\LoginPage.vue -->
<template>
  <main class="h-[100dvh] flex flex-col lg:flex-row bg-surface-page font-sans relative overflow-hidden">
    
    <!-- Theme Toggle -->
    <div class="absolute top-6 right-6 z-50">
      <ThemeToggle />
    </div>

    <!-- Bagian Kiri (Desktop) & Atas (Mobile): Ilustrasi / Branding -->
    <div class="w-full lg:w-1/2 bg-surface-brand relative flex flex-col justify-center px-6 pt-6 pb-8 lg:px-16 lg:py-0 h-[30dvh] lg:h-screen z-0">

      <!-- Mobile Back Button (Absolute) -->
      <button @click="$router.push('/')" class="lg:hidden absolute top-6 left-6 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md z-20">
        <IconArrowLeft class="w-4 h-4" aria-hidden="true" />
      </button>

      <div class="relative z-10 flex flex-col justify-center h-full">
        <!-- Desktop Logo -->
        <div class="hidden lg:flex items-center gap-3 mb-12">
          <img class="h-10 w-auto filter drop-shadow-lg" src="/images/logo.png" alt="Logo Aplikasi" />
          <span class="text-white text-2xl font-bold tracking-tight">Kainest</span>
        </div>

        <!-- Mobile Header (Arrow removed) -->
        <div class="lg:hidden flex flex-col gap-3 w-full mt-6">
          <h1 class="text-2xl font-bold text-white mb-1 leading-tight">
            Siap mengatur hari Anda?
          </h1>
          <p class="text-white/70 text-xs leading-relaxed pr-2">
            Masuk untuk menikmati pengalaman manajemen terbaik, dari keuangan hingga produktivitas.
          </p>
        </div>

        <!-- Desktop Typography -->
        <div class="hidden lg:block">
          <h1 class="text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
            Satu Aplikasi.<br />
            <span class="text-brand-muted">Beragam Kemudahan.</span>
          </h1>
          <p class="text-white/70 text-lg max-w-md leading-relaxed">
            Mulai dari manajemen keuangan, berbagi tagihan, hingga merekam aktivitas bersama pasangan—semua terpusat dan terintegrasi mulus dengan WhatsApp AI.
          </p>
        </div>
      </div>
    </div>

    <!-- Bagian Kanan (Desktop) & Bawah (Mobile): Form Login -->
    <div class="w-full lg:w-1/2 flex-1 flex flex-col justify-start lg:justify-center items-center relative z-10 lg:z-auto bg-surface-page lg:bg-transparent rounded-t-lg lg:rounded-none px-6 py-6 lg:p-12 mt-[-1.5rem] lg:mt-0 overflow-y-auto">
      
      <div class="w-full max-w-md space-y-6">
        <!-- Desktop Header Title -->
        <div class="hidden lg:block text-left mb-6">
          <h2 class="text-2xl font-bold text-text-primary tracking-tight tracking-tight">Selamat Datang kembali</h2>
          <p class="mt-2 text-sm text-text-secondary">
            Masuk ke akun Anda untuk melanjutkan aktivitas hari ini.
          </p>
        </div>

        <!-- Tab Toggle (Masuk / Daftar) -->
        <div class="flex p-1.5 bg-surface-subtle rounded-md w-full border border-border-default">
          <button class="flex-1 py-2.5 text-sm font-bold bg-surface-card text-text-primary rounded-md transition-all">
            Login
          </button>
          <button @click="$router.push('/register')" class="flex-1 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-all">
            Register
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="mt-6 space-y-4">
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

            <!-- Input Password -->
            <div class="relative">
              <label for="password" class="sr-only">Sandi</label>
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconLock class="h-5 w-5 text-text-muted" />
              </div>
              <input id="password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password" required
                class="block w-full pl-11 pr-12 py-3 bg-surface-input border border-border-default rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                placeholder="Password" />
              <button type="button" @click="showPassword = !showPassword" v-show="password.length > 0"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary focus:outline-none">
                <IconEye v-if="!showPassword" class="h-5 w-5" />
                <IconEyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Options Row -->
          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" v-model="rememberMe"
                class="h-4 w-4 text-brand-primary focus:ring-brand-primary border-border-default rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-text-secondary">
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <router-link to="/forgot-password" class="font-semibold text-brand-primary hover:text-brand-primary-hover">
                Forgot Password?
              </router-link>
            </div>
          </div>

          <!-- Tombol Submit -->
          <button type="submit" :disabled="auth.isLoading"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-md text-sm font-bold text-text-inverse bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4">
            {{ auth.isLoading ? "Memproses..." : "Login" }}
          </button>

          <!-- Separator -->
          <div class="relative mt-8 mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-border-default"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-4 bg-surface-page text-text-muted font-medium">Or login with</span>
            </div>
          </div>

          <!-- Tombol Social Login -->
          <div class="grid grid-cols-2 gap-4">
            <button type="button" @click="handleSocialLogin('google')"
              class="flex w-full items-center justify-center gap-2 px-4 py-3.5 bg-surface-card border border-border-default rounded-md text-sm font-bold text-text-primary hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border-strong">
              <svg class="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#EA4335"
                  d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 15.01 1 12 1 7.24 1 3.2 3.74 1.25 7.75l3.85 2.99C6.01 7.27 8.78 5.04 12 5.04z" />
                <path fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.41-4.92 3.41-8.6z" />
                <path fill="#FBBC05"
                  d="M5.1 10.74c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.25 3.17C.45 4.77 0 6.58 0 8.5s.45 3.73 1.25 5.33l3.85-3.09z" />
                <path fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.18.79-2.69 1.26-4.26 1.26-3.22 0-5.99-2.23-6.9-5.7l-3.85 2.99C3.2 20.26 7.24 23 12 23z" />
              </svg>
              Google
            </button>
            <button type="button" @click="handleSocialLogin('github')"
              class="flex w-full items-center justify-center gap-2 px-4 py-3.5 bg-surface-card border border-border-default rounded-md text-sm font-bold text-text-primary hover:bg-surface-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-border-strong">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Github
            </button>
          </div>

          <!-- Pesan Error -->
          <div v-if="auth.error"
            class="mt-4 p-3 bg-status-danger-bg border border-status-danger/30 rounded-md text-sm text-status-danger text-center">
            {{ auth.error }}
          </div>

          <!-- Link Registrasi -->
          <p class="mt-8 text-center text-sm text-text-secondary">
            Belum punya akun?
            <router-link to="/register" class="font-semibold text-brand-primary hover:text-brand-primary-hover transition-colors">
              Buat akun sekarang
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { IconArrowLeft, IconEye, IconEyeOff, IconLock, IconMail } from '@/ui/icons';
import { ref } from "vue";
import { useAuthStore } from "@/features/auth/presentation/stores/authStore";
import { useRouter } from "vue-router";
import ThemeToggle from "@/components/ThemeToggle.vue";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await auth.login({
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });
    router.push("/app/dashboard");
  } catch (error) {
    console.error("Gagal login dari komponen:", error.message);
  }
};

const handleSocialLogin = async (provider) => {
  try {
    await auth.loginSocial(provider);
  } catch (error) {
    console.error("Error saat inisiasi social login:", error);
  }
};
</script>
