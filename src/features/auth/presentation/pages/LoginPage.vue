<template>
  <main
    class="min-h-screen bg-[var(--color-violet-500)] flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
      <div class="text-center mb-8">
        <img
          class="mx-auto h-12 w-auto"
          src="/images/logo.png"
          alt="Logo Aplikasi"
        />
      </div>

      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-[var(--color-gray-800)] mb-2">
          Login Akun
        </h1>
        <p class="text-[var(--color-gray-600)] text-sm">
          Masukkan email dan sandi untuk melanjutkan
        </p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label
            class="block text-[var(--color-gray-700)] text-sm font-medium mb-2"
          >
            Alamat Email:
          </label>
          <input
            id="email-address"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            class="w-full px-4 py-3 bg-[var(--color-gray-100)] border-0 rounded-lg text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500)] focus:bg-white transition-all"
            placeholder="masukkan email"
          />
        </div>

        <div>
          <div class="flex justify-between items-center mb-2">
            <label
              class="block text-[var(--color-gray-700)] text-sm font-medium"
            >
              Sandi:
            </label>
            <a
              href="#"
              class="text-[var(--color-gray-500)] text-sm hover:text-[var(--color-violet-600)] transition-colors"
            >
              Lupa Password
            </a>
          </div>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password"
              required
              class="w-full px-4 py-3 bg-[var(--color-gray-100)] border-0 rounded-lg text-[var(--color-gray-800)] placeholder:text-[var(--color-gray-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500)] focus:bg-white transition-all pr-12"
              placeholder="masukkan password"
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

        <div class="flex items-center">
          <input
            id="remember-password"
            v-model="rememberPassword"
            type="checkbox"
            class="h-4 w-4 text-[var(--color-violet-600)] focus:ring-[var(--color-violet-500)] border-[var(--color-gray-300)] rounded"
          />
          <label
            for="remember-password"
            class="ml-2 text-sm text-[var(--color-gray-600)]"
          >
            Ingat Password
          </label>
        </div>

        <button
          type="submit"
          :disabled="auth.isLoading"
          class="w-full bg-[var(--color-violet-600)] hover:bg-[var(--color-violet-700)] disabled:bg-[var(--color-violet-300)] text-white font-medium py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-violet-500)] focus:ring-offset-2"
        >
          {{ auth.isLoading ? "Memproses..." : "Login" }}
        </button>

        <p
          v-if="auth.error"
          class="text-center text-sm text-[var(--color-red-600)]"
        >
          {{ auth.error }}
        </p>

        <div class="text-center mt-6">
          <a
            href="#"
            class="text-[var(--color-red-500)] text-sm hover:text-[var(--color-red-600)] transition-colors"
          >
            Lupa Password?
          </a>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "../stores/authStore"; // Pastikan path ini benar
import { useRouter } from "vue-router";

// Menginisialisasi variabel dengan string kosong
const email = ref("");
const password = ref("");
const rememberPassword = ref(false);
const showPassword = ref(false);

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await auth.login({
      email: email.value,
      password: password.value,
    });
    router.push("/dashboard");
  } catch (error) {
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
