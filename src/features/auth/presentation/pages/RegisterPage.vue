<!-- features\auth\presentation\pages\RegisterPage.vue -->
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
              Daftar untuk menikmati pengalaman manajemen terbaik, dari keuangan hingga produktivitas.
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

    <!-- Bagian Kanan (Desktop) & Bawah (Mobile): Form Register -->
    <div class="w-full lg:w-1/2 flex-1 flex flex-col justify-start lg:justify-center items-center relative z-10 lg:z-auto bg-white lg:bg-transparent rounded-t-[2rem] lg:rounded-none px-6 py-6 lg:p-12 mt-[-1.5rem] lg:mt-0 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] lg:shadow-none overflow-y-auto">
      
      <div class="w-full max-w-md space-y-6">
        <!-- Desktop Header Title -->
        <div class="hidden lg:block text-left mb-8">
          <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">Buat Akun Baru</h2>
          <p class="mt-2 text-sm text-gray-500">
            Bergabung dengan ribuan pengguna lainnya hari ini.
          </p>
        </div>

        <!-- Tab Toggle (Masuk / Daftar) -->
        <div class="flex p-1.5 bg-gray-100/80 rounded-2xl w-full">
          <button @click="$router.push('/login')" class="flex-1 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-all">
            Login
          </button>
          <button class="flex-1 py-2.5 text-sm font-bold bg-white text-gray-900 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] transition-all">
            Register
          </button>
        </div>

        <form @submit.prevent="handleRegister" class="mt-6 space-y-4">
          <div class="space-y-3">
            <!-- Input Nama -->
            <div class="relative">
              <label for="display-name" class="sr-only">Nama Panggilan</label>
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserIcon class="h-5 w-5 text-gray-400" />
              </div>
              <input id="display-name" v-model="displayName" name="displayName" type="text" autocomplete="name" required
                class="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Nama Panggilan" />
            </div>

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
                autocomplete="new-password" required
                class="block w-full pl-11 pr-12 py-3 bg-white border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all shadow-sm"
                placeholder="Password (Min. 6 karakter)" />
              <button type="button" @click="showPassword = !showPassword" v-show="password.length > 0"
                class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeSlashIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <!-- Term of service -->
          <div class="flex items-start pt-1">
            <div class="flex items-center h-5">
              <input id="terms" name="terms" type="checkbox" required
                class="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded" />
            </div>
            <div class="ml-2 text-xs">
              <label for="terms" class="text-gray-500">I agree to the <a href="#" class="text-violet-600 hover:text-violet-500 font-medium">Terms</a> and <a href="#" class="text-violet-600 hover:text-violet-500 font-medium">Privacy Policy</a></label>
            </div>
          </div>

          <!-- Tombol Submit -->
          <button type="submit" :disabled="auth.isLoading"
            class="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-2xl shadow-lg shadow-violet-500/30 text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4">
            {{ auth.isLoading ? "Memproses..." : "Register" }}
          </button>

          <!-- Pesan Error -->
          <div v-if="auth.error"
            class="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 text-center">
            {{ auth.error }}
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { EyeIcon, EyeSlashIcon, EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/features/auth/presentation/stores/authStore";
import { useRouter } from "vue-router";

const displayName = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const auth = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  try {
    await auth.register({
      email: email.value,
      password: password.value,
      displayName: displayName.value,
    });
    router.push("/login");
  } catch (error) {
    console.error("Gagal registrasi dari komponen:", error.message);
  }
};
</script>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
