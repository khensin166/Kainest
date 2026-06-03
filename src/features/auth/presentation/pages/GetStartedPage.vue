<!-- GetStartedPage.vue -->
<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 overflow-hidden relative font-sans">
    
    <!-- Background Ambient Gradients -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div class="absolute top-40 -right-40 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-40 left-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Main Content Glassmorphism Card -->
    <div class="relative z-10 w-full max-w-lg mt-12 md:mt-0">
      
      <!-- Showcase Visual Area -->
      <div class="relative w-full h-56 md:h-64 mb-8 flex items-center justify-center">
        <!-- Center glowing orb -->
        <div class="absolute inset-0 bg-violet-500 rounded-full animate-ping opacity-20 blur-xl w-32 h-32 m-auto"></div>
        <div class="absolute w-24 h-24 bg-gradient-to-tr from-violet-600 to-fuchsia-500 rounded-full shadow-[0_0_40px_rgba(139,92,246,0.6)] flex items-center justify-center z-10 border-4 border-gray-900">
           <!-- Mengganti logo gambar menjadi teks K elegan agar tidak aneh -->
           <span class="text-xl font-black text-white tracking-tighter">Kainest</span>
        </div>

        <!-- Floating Chips -->
        <div class="absolute top-2 left-0 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 float-anim float-delay-1">
          <span>💰</span> AI Budgeting
        </div>
        <div class="absolute bottom-6 right-0 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 float-anim float-delay-2">
          <span>🧾</span> Split Bill
        </div>
        <div class="absolute top-10 right-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 float-anim float-delay-3">
          <span>💖</span> Couple Connect
        </div>
        <div class="absolute bottom-12 left-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 float-anim float-delay-4">
          <span>📄</span> Invoicing
        </div>
        <div class="absolute -top-2 right-1/4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 float-anim float-delay-2">
          <span>✅</span> Todo List
        </div>
        <div class="absolute -bottom-2 left-1/4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-lg flex items-center gap-2 float-anim float-delay-3">
          <span>🔔</span> Reminder
        </div>
      </div>

      <div class="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl text-center transform transition-all duration-700 hover:scale-[1.01]">
        
        <!-- Typography -->
        <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Satu Platform.<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-300">Beragam Solusi Anda.</span>
        </h1>
        <p class="text-gray-300 text-sm md:text-base mb-10 leading-relaxed font-light">
          Dari pencatatan keuangan pintar hingga kolaborasi dengan pasangan, semua terpusat dan terintegrasi otomatis.
        </p>

        <!-- CTA Button -->
        <button 
          @click="handleStart"
          class="group relative inline-flex items-center justify-center w-full px-8 py-4 font-bold text-white transition-all duration-300 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-2xl hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none focus:ring-4 focus:ring-violet-500/50 overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]"
        >
          <span class="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-96 ease"></span>
          <span class="relative flex items-center gap-2 text-lg">
            Mulai Sekarang 
            <svg class="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </span>
        </button>
      </div>

      <!-- Footer indicator -->
      <div class="text-center mt-8 text-gray-500 text-xs font-medium tracking-widest uppercase">
        By Kenan Tomfie Bukit
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const handleStart = () => {
  router.push("/login");
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

.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes floatAnim {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(2deg); }
}

.float-anim {
  animation: floatAnim 4s ease-in-out infinite;
}
.float-delay-1 { animation-delay: 0s; }
.float-delay-2 { animation-delay: 1s; }
.float-delay-3 { animation-delay: 2s; }
.float-delay-4 { animation-delay: 3s; }
</style>
