<!--features\auth\presentation\pages\LoginPage.vue -->
<template>
  <main
    class="min-h-screen bg-[var(--color-violet-500)] flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
      <!-- Bagian Logo -->
      <div class="text-center mb-8">
        <img
          class="mx-auto h-12 w-auto"
          src="/images/logo.png"
          alt="Logo Aplikasi"
        />
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
          <label
            for="email-address"
            class="block text-[var(--color-gray-700)] text-sm font-medium mb-2"
          >
            Alamat Email
          </label>
          <input
            id="email-address"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="w-full px-4 py-3 bg-[var(--color-gray-100)] border-0 rounded-lg text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500)] focus:bg-white transition-all"
            placeholder="contoh@email.com"
          />
        </div>

        <!-- Input Password -->
        <div>
          <label
            for="password"
            class="block text-[var(--color-gray-700)] text-sm font-medium mb-2"
          >
            Sandi
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="w-full px-4 py-3 bg-[var(--color-gray-100)] border-0 rounded-lg text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500)] focus:bg-white transition-all pr-12"
              placeholder="Masukkan sandi Anda"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              v-show="password.length > 0"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)]"
            >
              <EyeIcon v-if="!showPassword" class="w-5 h-5" />
              <EyeSlashIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Tombol Submit -->
        <button
          type="submit"
          :disabled="auth.isLoading"
          class="w-full bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] disabled:bg-[var(--color-violet-300)] text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500)] focus:ring-offset-2"
        >
          {{ auth.isLoading ? "Memproses..." : "Login" }}
        </button>

        <!-- Pesan Error dari Store (jika ada) -->
        <p
          v-if="auth.error"
          class="text-center text-sm text-[var(--color-red-600)]"
        >
          {{ auth.error }}
        </p>

        <!-- Link ke Halaman Registrasi -->
        <div class="text-center mt-6">
          <p class="text-sm text-[var(--color-gray-600)]">
            Belum punya akun?
            <router-link
              to="/register"
              class="font-medium text-[var(--color-violet-600)] hover:text-[var(--color-violet-800)]"
            >
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
</script>

<style scoped>
/* Additional custom styles if needed */
.transition-all {
  transition: all 0.3s ease;
}
</style>
