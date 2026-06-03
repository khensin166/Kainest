<!--features\auth\presentation\pages\LoginPage.vue -->
<template>
  <main class="h-[100dvh] flex flex-col lg:flex-row bg-gray-900 lg:bg-gray-50 font-sans relative overflow-hidden">
    
    <!-- Bagian Kiri (Desktop) & Atas (Mobile): Ilustrasi / Branding -->
    <div class="w-full lg:w-1/2 bg-gray-900 relative flex flex-col justify-center px-6 pt-6 pb-8 lg:px-16 lg:py-0 h-[30dvh] lg:h-screen z-0">
      <!-- Ambient Background -->
      <div class="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div class="absolute top-1/4 -left-20 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div class="absolute bottom-1/4 right-0 w-72 h-72 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <!-- Mobile Back Button (Absolute) -->
      <button @click="$router.push('/')" class="lg:hidden absolute top-6 left-6 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-md z-20">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
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
            <p class="text-gray-400 text-xs font-light leading-relaxed pr-2">
              Masuk untuk menikmati pengalaman manajemen terbaik, dari keuangan hingga produktivitas.
            </p>
          </div>

        <!-- Desktop Typography -->
        <div class="hidden lg:block">
          <h1 class="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Satu Aplikasi.<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-300">Beragam Kemudahan.</span>
          </h1>
          <p class="text-gray-400 text-lg max-w-md font-light leading-relaxed">
            Mulai dari manajemen keuangan, berbagi tagihan, hingga merekam aktivitas bersama pasangan—semua terpusat dan terintegrasi mulus dengan WhatsApp AI.
          </p>
        </div>
      </div>
      
      <!-- Abstract Graphic Desktop -->
      <div class="hidden lg:block absolute -bottom-32 -right-32 opacity-20 pointer-events-none">
        <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#8B5CF6" d="M45.7,-76.4C58.9,-69.3,69.1,-55.4,75.8,-40.5C82.5,-25.6,85.7,-9.6,83.4,5.4C81.1,20.4,73.3,34.4,63.1,45.4C52.9,56.4,40.3,64.4,26.4,70.5C12.5,76.6,-2.7,80.8,-17.5,78.2C-32.3,75.6,-46.7,66.2,-57.4,53.8C-68.1,41.4,-75.1,26,-78.3,10.2C-81.5,-5.6,-80.9,-21.8,-74.1,-34.7C-67.3,-47.6,-54.3,-57.2,-40.6,-63.9C-26.9,-70.6,-13.5,-74.4,1.4,-76.3C16.3,-78.2,32.5,-78.2,45.7,-76.4Z" transform="translate(100 100)" />
        </svg>
      </div>
    </div>

    <!-- Bagian Kanan (Desktop) & Bawah (Mobile): Form Login -->
    <div class="w-full lg:w-1/2 flex-1 flex flex-col justify-start lg:justify-center items-center relative z-10 lg:z-auto bg-white lg:bg-transparent rounded-t-[2rem] lg:rounded-none px-6 py-6 lg:p-12 mt-[-1.5rem] lg:mt-0 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] lg:shadow-none overflow-y-auto">
      
      <div class="w-full max-w-md space-y-6">
        <!-- Desktop Header Title -->
        <div class="hidden lg:block text-left mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Selamat Datang kembali</h2>
          <p class="mt-2 text-sm text-gray-500">
            Masuk ke akun Anda untuk melanjutkan aktivitas hari ini.
          </p>
        </div>

        <!-- Tab Toggle (Masuk / Daftar) -->
        <div class="flex p-1.5 bg-gray-100/80 rounded-2xl w-full">
          <button class="flex-1 py-2.5 text-sm font-bold bg-white text-gray-900 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all">
            Login
          </button>
          <button @click="$router.push('/register')" class="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all">
            Register
          </button>
        </div>

        <form @submit.prevent="handleLogin" class="mt-6 space-y-4">
          <div class="space-y-3">
            <!-- Input Email -->
            <div class="relative">
              <label for="email-address" class="sr-only">Alamat Email</label>
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input id="email-address" v-model="email" name="email" type="email" autocomplete="email" required
                class="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Email Address" />
            </div>

            <!-- Input Password -->
            <div class="relative">
              <label for="password" class="sr-only">Sandi</label>
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockClosedIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input id="password" v-model="password" name="password" :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password" required
                class="block w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Password" />
              <button type="button" @click="showPassword = !showPassword" v-show="password.length > 0"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Options Row -->
          <div class="flex items-center justify-between pt-1">
            <div class="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox"
                class="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <div class="text-sm">
              <a href="#" class="font-semibold text-violet-600 hover:text-violet-500">
                Forgot Password?
              </a>
            </div>
          </div>

          <!-- Tombol Submit -->
          <button type="submit" :disabled="auth.isLoading"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-violet-500/30 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4">
            {{ auth.isLoading ? "Memproses..." : "Login" }}
          </button>

          <!-- Separator -->
          <div class="relative mt-8 mb-8">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-100"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-4 bg-white lg:bg-transparent text-gray-500 font-medium">Or login with</span>
            </div>
          </div>

          <!-- Tombol Social Login -->
          <div class="grid grid-cols-2 gap-4">
            <button type="button" @click="handleSocialLogin('google')"
              class="flex w-full items-center justify-center gap-2 px-4 py-3.5 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
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
              class="flex w-full items-center justify-center gap-2 px-4 py-3.5 bg-white border border-gray-200 rounded-full shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
              <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              Github
            </button>
          </div>

          <!-- Pesan Error -->
          <div v-if="auth.error"
            class="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
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
