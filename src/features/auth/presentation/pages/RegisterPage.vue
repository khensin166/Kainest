<!-- features\auth\presentation\pages\RegisterPage.vue -->
<template>
  <main class="h-[100dvh] flex flex-col lg:flex-row bg-surface-page font-sans relative overflow-hidden">

    <!-- Theme Toggle -->
    <div class="absolute top-6 right-6 z-50">
      <ThemeToggle />
    </div>

    <!-- Bagian Kiri (Desktop) & Atas (Mobile): Ilustrasi / Branding -->
    <div
      class="w-full lg:w-1/2 bg-surface-brand relative flex flex-col justify-center px-6 pt-6 pb-8 lg:px-16 lg:py-0 h-[30dvh] lg:h-screen z-0">

      <!-- Mobile Back Button (Absolute) -->
      <button @click="$router.push('/')"
        class="lg:hidden absolute top-6 left-6 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md z-20">
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
          <p class="text-white/70 text-xs font-light leading-relaxed pr-2">
            Daftar untuk menikmati pengalaman manajemen terbaik, dari keuangan hingga produktivitas.
          </p>
        </div>

        <!-- Desktop Typography -->
        <div class="hidden lg:block">
          <h1 class="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Satu Aplikasi.<br />
            <span class="text-brand-muted">Beragam
              Kemudahan.</span>
          </h1>
          <p class="text-white/70 text-lg max-w-md font-light leading-relaxed">
            Mulai dari manajemen keuangan, berbagi tagihan, hingga merekam aktivitas bersama pasangan—semua terpusat dan
            terintegrasi mulus dengan WhatsApp AI.
          </p>
        </div>
      </div>

    </div>

    <!-- Bagian Kanan (Desktop) & Bawah (Mobile): Form Register -->
    <div
      class="w-full lg:w-1/2 flex-1 flex flex-col justify-start lg:justify-center items-center relative z-10 lg:z-auto bg-surface-page lg:bg-transparent rounded-t-lg lg:rounded-none px-6 py-6 lg:p-12 mt-[-1.5rem] lg:mt-0 overflow-y-auto">

      <div class="w-full max-w-md space-y-6">
        <!-- Desktop Header Title -->
        <div class="hidden lg:block text-left mb-6">
          <h2 class="text-2xl font-bold text-text-primary tracking-tight tracking-tight">Buat Akun Baru</h2>
          <p class="mt-2 text-sm text-text-secondary">
            Bergabung dengan ribuan pengguna lainnya hari ini.
          </p>
        </div>

        <!-- Tab Toggle (Masuk / Daftar) -->
        <div class="flex p-1.5 bg-surface-subtle rounded-md w-full border border-border-default">
          <button @click="$router.push('/login')"
            class="flex-1 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-all">
            Login
          </button>
          <button
            class="flex-1 py-2.5 text-sm font-bold bg-surface-card text-text-primary rounded-md transition-all">
            Register
          </button>
        </div>

        <form @submit.prevent="handleRegister" class="mt-6 space-y-4">
          <div class="space-y-3">
            <!-- Input Nama -->
            <div class="relative">
              <label for="display-name" class="sr-only">Nama Panggilan</label>
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconUser class="h-5 w-5 text-text-muted" />
              </div>
              <input id="display-name" v-model="displayName" name="displayName" type="text" autocomplete="name" required
                class="block w-full pl-11 pr-4 py-3 bg-surface-input border border-border-default rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                placeholder="Nama Panggilan" />
            </div>

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
                autocomplete="new-password" required
                class="block w-full pl-11 pr-12 py-3 bg-surface-input border border-border-default rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                placeholder="Password (Min. 6 karakter)" />
              <button type="button" @click="showPassword = !showPassword" v-show="password.length > 0"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-text-muted hover:text-text-primary focus:outline-none">
                <IconEye v-if="!showPassword" class="h-5 w-5" />
                <IconEyeOff v-else class="h-5 w-5" />
              </button>
            </div>

            <!-- Input Confirm Password -->
            <div class="relative">
              <label for="confirm-password" class="sr-only">Konfirmasi Sandi</label>
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconLock class="h-5 w-5 text-text-muted" />
              </div>
              <input id="confirm-password" v-model="confirmPassword" name="confirmPassword" :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password" required
                class="block w-full pl-11 pr-12 py-3 bg-surface-input border border-border-default rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all"
                placeholder="Ulangi Password" />
            </div>
          </div>

          <!-- Term of service -->
          <div class="flex items-start pt-1">
            <div class="flex items-center h-5">
              <input id="terms" name="terms" type="checkbox" required
                class="h-4 w-4 text-brand-primary focus:ring-brand-primary border-border-default rounded" />
            </div>
            <div class="ml-2 text-xs">
              <label for="terms" class="text-text-muted">I agree to the <a href="#" @click.prevent="showTerms"
                  class="text-brand-primary hover:text-brand-primary-hover font-medium">Terms</a> and <a href="#"
                  @click.prevent="showPrivacy" class="text-brand-primary hover:text-brand-primary-hover font-medium">Privacy
                  Policy</a></label>
            </div>
          </div>

          <!-- Tombol Submit -->
          <button type="submit" :disabled="auth.isLoading"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-md text-sm font-bold text-text-inverse bg-brand-primary hover:bg-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4">
            {{ auth.isLoading ? "Memproses..." : "Register" }}
          </button>

          <!-- Pesan Error -->
          <div v-if="auth.error"
            class="mt-4 p-3 bg-status-danger-bg border border-status-danger/30 rounded-md text-sm text-status-danger text-center">
            {{ auth.error }}
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { IconArrowLeft, IconEye, IconEyeOff, IconLock, IconMail, IconUser } from '@/ui/icons';
import { ref } from "vue";
import { useAuthStore } from "@/features/auth/presentation/stores/authStore";
import { useModalStore } from "@/stores/modalStore";
import { useRouter } from "vue-router";
import { termsOfService, privacyPolicy } from "@/data/legalContent";
import ThemeToggle from "@/components/ThemeToggle.vue";

const displayName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);

const auth = useAuthStore();
const router = useRouter();
const modalStore = useModalStore();

const showTerms = () => {
  modalStore.openContentModal({
    title: "Ketentuan Layanan",
    htmlBody: termsOfService
  });
};

const showPrivacy = () => {
  modalStore.openContentModal({
    title: "Kebijakan Privasi",
    htmlBody: privacyPolicy
  });
};

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    auth.error = "Konfirmasi kata sandi tidak cocok.";
    return;
  }

  try {
    await auth.register({
      email: email.value,
      password: password.value,
      displayName: displayName.value,
    });
    
    // Clear form
    email.value = "";
    password.value = "";
    confirmPassword.value = "";
    displayName.value = "";
    showPassword.value = false;

    router.push("/login");
  } catch (error) {
    console.error("Gagal registrasi dari komponen:", error.message);
  }
};
</script>
