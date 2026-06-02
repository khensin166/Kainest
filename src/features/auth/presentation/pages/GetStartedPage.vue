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
    <div class="relative z-10 w-full max-w-lg">
      <div class="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-center transform transition-all duration-700 hover:scale-[1.02]">
        
        <!-- Mockup Visual / Icon -->
        <div class="relative w-32 h-32 mx-auto mb-8 flex items-center justify-center">
          <div class="absolute inset-0 bg-violet-500 rounded-full animate-ping opacity-20"></div>
          <div class="absolute inset-2 bg-gradient-to-tr from-violet-600 to-fuchsia-500 rounded-full shadow-[0_0_40px_rgba(139,92,246,0.5)]"></div>
          <svg class="w-16 h-16 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <!-- Floating Coin Badge -->
          <div class="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 border-2 border-gray-900 shadow-lg bounce-subtle">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
        </div>

        <!-- Typography -->
        <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Catat Pengeluaran.<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-300">Semudah Chatting.</span>
        </h1>
        <p class="text-gray-300 text-sm md:text-base mb-10 leading-relaxed font-light">
          Biarkan AI cerdas Kainest yang merapikan keuanganmu. Cukup ketik di WhatsApp, sisanya kami yang urus.
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
        Powered by Groq AI
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

@keyframes bounceSubtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.bounce-subtle {
  animation: bounceSubtle 3s ease-in-out infinite;
}
</style>
