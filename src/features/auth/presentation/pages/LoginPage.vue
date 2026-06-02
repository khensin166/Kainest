<!--features\auth\presentation\pages\LoginPage.vue -->
<template>
  <main
    class="min-h-screen flex bg-[var(--color-violet-500)] lg:bg-gray-50 items-center justify-center lg:items-stretch">

    <!-- Bagian Kiri: Ilustrasi / Branding (Hanya tampil di Desktop) -->
    <div class="hidden lg:flex lg:w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-center px-16">
      <!-- Ambient Background -->
      <div class="absolute inset-0 overflow-hidden z-0">
        <div
          class="absolute top-1/4 -left-20 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob">
        </div>
        <div
          class="absolute bottom-1/4 right-0 w-72 h-72 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000">
        </div>
      </div>

      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-12">
          <img class="h-10 w-auto filter drop-shadow-lg" src="/images/logo.png" alt="Logo Aplikasi" />
          <span class="text-white text-2xl font-bold tracking-tight">Kainest</span>
        </div>

        <h1 class="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
          Kendalikan Uangmu<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-300">Dengan Bantuan
            AI.</span>
        </h1>
        <p class="text-gray-400 text-lg max-w-md font-light leading-relaxed">
          Tautkan WhatsApp Anda dan rasakan kemudahan mencatat pengeluaran tanpa perlu membuka aplikasi.
        </p>
      </div>

      <!-- Abstract Graphic -->
      <div class="absolute -bottom-32 -right-32 opacity-20 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#8B5CF6"
            d="M45.7,-76.4C58.9,-69.3,69.1,-55.4,75.8,-40.5C82.5,-25.6,85.7,-9.6,83.4,5.4C81.1,20.4,73.3,34.4,63.1,45.4C52.9,56.4,40.3,64.4,26.4,70.5C12.5,76.6,-2.7,80.8,-17.5,78.2C-32.3,75.6,-46.7,66.2,-57.4,53.8C-68.1,41.4,-75.1,26,-78.3,10.2C-81.5,-5.6,-80.9,-21.8,-74.1,-34.7C-67.3,-47.6,-54.3,-57.2,-40.6,-63.9C-26.9,-70.6,-13.5,-74.4,1.4,-76.3C16.3,-78.2,32.5,-78.2,45.7,-76.4Z"
            transform="translate(100 100)" />
        </svg>
      </div>
    </div>

    <!-- Bagian Kanan: Form Login -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 relative">

      <!-- Container Card: Card putih di mobile, flat di Desktop -->
      <div
        class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 lg:bg-transparent lg:rounded-none lg:shadow-none lg:p-0 space-y-6 lg:space-y-8">

        <!-- Mobile Logo (Hanya muncul di mobile di dalam card) -->
        <div class="flex lg:hidden items-center justify-center mb-2">
          <img class="h-12 w-auto" src="/images/logo.png" alt="Logo Aplikasi" />
        </div>

        <div class="text-center lg:text-left">
          <h2 class="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Selamat Datang</h2>
          <p class="mt-2 text-sm text-gray-500">
            Masuk ke akun Anda untuk melanjutkan perjalanan finansial.
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="mt-8 space-y-6">
          <div class="space-y-4">
            <!-- Input Email -->
            <div>
              <label for="email-address" class="block text-sm font-semibold text-gray-700 mb-1">
                Alamat Email
              </label>
              <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required
                class="block w-full px-4 py-3 bg-[var(--color-gray-100)] lg:bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow shadow-sm"
                placeholder="nama@email.com" />
            </div>

            <!-- Input Password -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-700 mb-1">
                Sandi
              </label>
              <div class="relative">
                <input id="password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password" required
                  class="block w-full px-4 py-3 bg-[var(--color-gray-100)] lg:bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-shadow shadow-sm pr-12"
                  placeholder="Masukkan sandi Anda" />
                <button type="button" @click="showPassword = !showPassword" v-show="password.length > 0"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                  <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                  <EyeSlashIcon v-else class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Tombol Submit -->
          <button type="submit" :disabled="auth.isLoading"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all">
            {{ auth.isLoading ? "Memproses..." : "Masuk ke Akun" }}
          </button>

          <!-- Separator -->
          <div class="relative mt-6 mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-xs sm:text-sm">
              <span class="px-2 sm:px-3 bg-white lg:bg-gray-50 text-gray-500 font-medium">Atau lanjutkan dengan</span>
            </div>
          </div>

          <!-- Tombol Social Login -->
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <button type="button" @click="handleSocialLogin('google')"
              class="flex w-full items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
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
              class="flex w-full items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          <!-- Pesan Error -->
          <div v-if="auth.error"
            class="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
            {{ auth.error }}
          </div>

          <!-- Link Registrasi -->
          <p class="mt-8 text-center text-sm text-gray-600">
            Belum punya akun?
            <router-link to="/register" class="font-semibold text-violet-600 hover:text-violet-500 transition-colors">
              Buat akun sekarang
            </router-link>
          </p>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/features/auth/presentation/stores/authStore";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const showPassword = ref(false);

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  try {
    await auth.login({
      email: email.value,
      password: password.value,
    });
    router.push("/app/dashboard");
  } catch (error) {
    console.error("Gagal login dari komponen:", error.message);
  }
};

const handleSocialLogin = async (provider) => {
  try {
    const backendUrl = import.meta.env.VITE_API_BASE_URL_STG;
    const callbackUrl = `${backendUrl}/auth/social-callback`;
    await auth.loginSocial(provider, callbackUrl);
  } catch (error) {
    console.error("Error saat inisiasi social login:", error);
  }
};
</script>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
