<!-- GetStartedPage.vue -->
<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 overflow-hidden relative font-sans">
    
    <!-- Background Ambient Gradients -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div class="absolute top-40 -right-40 w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-40 left-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Main Display Area -->
    <div class="relative z-10 w-full h-screen max-h-[900px] min-h-[600px] flex flex-col items-center justify-center">

      <!-- Desktop Radial Bubbles & Lines (Hidden on Mobile) -->
      <div class="hidden md:block absolute inset-0 w-full h-full pointer-events-none">
        
        <!-- Background SVG Lines -->
        <svg class="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
          <!-- Lines from center (600, 400) to the nodes -->
          <line x1="600" y1="400" x2="600" y2="120" stroke="white" stroke-width="1" /> <!-- Top Center -->
          <line x1="600" y1="400" x2="240" y2="224" stroke="white" stroke-width="1" /> <!-- Top Left -->
          <line x1="600" y1="400" x2="960" y2="224" stroke="white" stroke-width="1" /> <!-- Top Right -->
          <line x1="600" y1="400" x2="300" y2="640" stroke="white" stroke-width="1" /> <!-- Bottom Left -->
          <line x1="600" y1="400" x2="900" y2="640" stroke="white" stroke-width="1" /> <!-- Bottom Right -->
          
          <!-- Concentric circles behind the main card -->
          <circle cx="600" cy="400" r="280" fill="none" stroke="white" stroke-width="1" stroke-dasharray="4 4" />
          <circle cx="600" cy="400" r="400" fill="none" stroke="white" stroke-width="1" />
        </svg>

        <!-- Node: Couple Connect (Top Center) -->
        <div class="absolute top-[8%] left-1/2 -translate-x-1/2 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-2xl p-3 flex flex-col items-center justify-center z-10 w-48 float-anim float-delay-1 pointer-events-auto hover:scale-105 transition-transform shadow-xl cursor-default">
          <div class="text-2xl mb-1">💍</div>
          <div class="text-white text-sm font-bold">Couple Connect</div>
          <div class="text-gray-400 text-[10px]">Track joint accounts</div>
        </div>

        <!-- Node: AI Budgeting (Top Left) -->
        <div class="absolute top-[25%] left-[20%] -translate-x-1/2 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-2xl p-3 flex items-center gap-3 z-10 w-56 float-anim float-delay-2 pointer-events-auto hover:scale-105 transition-transform shadow-xl cursor-default">
          <div class="flex-1 text-right">
            <div class="text-white text-sm font-bold">AI Budgeting</div>
            <div class="text-gray-400 text-[10px]">Auto-categorize transactions</div>
          </div>
          <div class="text-3xl">🧠</div>
        </div>

        <!-- Node: Todo List (Top Right) -->
        <div class="absolute top-[25%] right-[20%] translate-x-1/2 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-2xl p-3 flex items-center gap-3 z-10 w-56 float-anim float-delay-3 pointer-events-auto hover:scale-105 transition-transform shadow-xl cursor-default">
          <div class="text-3xl">📋</div>
          <div class="flex-1 text-left">
            <div class="text-white text-sm font-bold">Todo List</div>
            <div class="text-gray-400 text-[10px]">Check list on smart and fast</div>
          </div>
        </div>

        <!-- Node: Split Bill (Bottom Left) -->
        <div class="absolute bottom-[18%] left-[25%] -translate-x-1/2 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-2xl p-3 flex items-center gap-3 z-10 w-56 float-anim float-delay-4 pointer-events-auto hover:scale-105 transition-transform shadow-xl cursor-default">
          <div class="flex-1 text-right">
            <div class="text-white text-sm font-bold">Split Bill</div>
            <div class="text-gray-400 text-[10px]">Auto split bill from receipts</div>
          </div>
          <div class="text-3xl">💸</div>
        </div>

        <!-- Node: Reminder (Bottom Right) -->
        <div class="absolute bottom-[18%] right-[25%] translate-x-1/2 bg-gray-800/90 backdrop-blur-md border border-gray-700 rounded-2xl p-3 flex items-center gap-3 z-10 w-56 float-anim float-delay-1 pointer-events-auto hover:scale-105 transition-transform shadow-xl cursor-default">
          <div class="text-3xl">🔔</div>
          <div class="flex-1 text-left">
            <div class="text-white text-sm font-bold">Reminder</div>
            <div class="text-gray-400 text-[10px]">Reminder activity</div>
          </div>
        </div>
      </div>

      <!-- Center Main Content Card -->
      <div class="relative z-30 w-full max-w-lg bg-gray-800/70 backdrop-blur-2xl border border-gray-700/50 p-8 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] text-center transform transition-all duration-700 hover:scale-[1.01]">
        <!-- Typography -->
        <h1 class="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight leading-tight">
           Kainest Application.<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-300">Solusi Terintegrasi Anda.</span>
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

    </div>

    <!-- Footer indicator -->
    <div class="relative z-30 text-center mt-8 text-gray-500 text-xs font-medium tracking-widest uppercase">
      By Kenan Tomfie Bukit
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


