<!--features\auth\presentation\pages\LoginPage.vue -->
<template>
  <main class="min-h-screen bg-[var(--color-violet-500)] flex items-center justify-center p-4">
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
      <!-- Bagian Logo -->
      <div class="text-center mb-8">
        <img class="mx-auto h-12 w-auto" src="/images/logo.png" alt="Logo Aplikasi" />
      </div>

      <!-- Bagian Judul -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-[var(--color-gray-800)] mb-2">
          Selamat Datang Kembali
        </h1>
        <p class="text-[var(--color-gray-600)] text-sm">
          Masukkan email dan sandi untuk melanjutkan.
        </p>
      </div>

      <!-- Form Login -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Input Email -->
        <div>
          <label for="email-address" class="block text-[var(--color-gray-700)] text-sm font-medium mb-2">
            Alamat Email
          </label>
          <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required
            class="w-full px-4 py-3 bg-[var(--color-gray-100)] border-0 rounded-lg text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500)] focus:bg-white transition-all"
            placeholder="contoh@email.com" />
        </div>

        <!-- Input Password -->
        <div>
          <label for="password" class="block text-[var(--color-gray-700)] text-sm font-medium mb-2">
            Sandi
          </label>
          <div class="relative">
            <input id="password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password" required
              class="w-full px-4 py-3 bg-[var(--color-gray-100)] border-0 rounded-lg text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500)] focus:bg-white transition-all pr-12"
              placeholder="Masukkan sandi Anda" />
            <button type="button" @click="showPassword = !showPassword" v-show="password.length > 0"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)]">
              <EyeIcon v-if="!showPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Tombol Submit -->
        <button type="submit" :disabled="auth.isLoading"
          class="w-full bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] disabled:bg-[var(--color-violet-300)] text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500)] focus:ring-offset-2">
          {{ auth.isLoading ? "Memproses..." : "Login" }}
        </button>

        <!-- Separator -->
        <div class="relative flex py-2 items-center">
          <div class="flex-grow border-t border-[var(--color-gray-200)]"></div>
          <span class="flex-shrink mx-4 text-[var(--color-gray-400)] text-xs">Atau masuk dengan</span>
          <div class="flex-grow border-t border-[var(--color-gray-200)]"></div>
        </div>

        <!-- Tombol Social Login -->
        <div class="grid grid-cols-2 gap-3">
          <button type="button" @click="handleSocialLogin('google')"
            class="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--color-gray-200)] rounded-lg text-sm font-medium text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)] transition-colors">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
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
            class="flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--color-gray-200)] rounded-lg text-sm font-medium text-[var(--color-gray-700)] hover:bg-[var(--color-gray-50)] transition-colors">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </button>
        </div>

        <!-- Pesan Error dari Store (jika ada) -->
        <p v-if="auth.error" class="text-center text-sm text-[var(--color-red-600)]">
          {{ auth.error }}
        </p>

        <!-- Link ke Halaman Registrasi -->
        <div class="text-center mt-6">
          <p class="text-sm text-[var(--color-gray-600)]">
            Belum punya akun?
            <router-link to="/register"
              class="font-medium text-[var(--color-violet-600)] hover:text-[var(--color-violet-800)]">
              Daftar di sini
            </router-link>
          </p>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/features/auth/presentation/stores/authStore";
import { useRouter } from "vue-router";

// State untuk form input
const email = ref("");
const password = ref("");
const showPassword = ref(false);

// Mengambil instance store dan router
const auth = useAuthStore();
const router = useRouter();

// Fungsi untuk menangani proses login
const handleLogin = async () => {
  try {
    await auth.login({
      email: email.value,
      password: password.value,
    });

    // Jika login berhasil, store akan menampilkan modal sukses,
    // dan kita akan redirect ke dashboard.
    router.push("/app/dashboard");
  } catch (error) {
    // Error sudah ditangani oleh store (menampilkan modal error),
    // jadi kita hanya perlu mencatatnya di console untuk debugging.
    console.error("Gagal login dari komponen:", error.message);
  }
};

// Fungsi untuk menangani login sosial (Google & GitHub)
const handleSocialLogin = async (provider) => {
  try {
    const callbackUrl = `${window.location.origin}/app/dashboard`;
    await auth.loginSocial(provider, callbackUrl);
  } catch (error) {
    console.error("Error saat inisiasi social login:", error);
  }
};
</script>

<style scoped>
/* Additional custom styles if needed */
.transition-all {
  transition: all 0.3s ease;
}
</style>
