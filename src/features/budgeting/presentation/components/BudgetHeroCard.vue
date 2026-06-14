<!-- BudgetHeroCard.vue -->
<script setup>
import DailyTrendSparkline from './DailyTrendSparkline.vue';
import { formatRupiah as formatCurrency } from '@/utils/Utils';

const props = defineProps({
  totalRemaining: {
    type: Number,
    required: true,
  },
  totalIncome: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  momIncome: {
    type: Number,
    default: null,
  },
  momSpent: {
    type: Number,
    default: null,
  },
  unallocated: {
    type: Number,
    default: 0,
  },
  monthName: {
    type: String,
    default: 'Bulan Ini',
  },
  trendData: {
    type: Object,
    default: null, // Bisa null jika data belum siap
  }
});
</script>

<template>
  <div
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden relative">

    <!-- Efek kilau glassmorphism -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-white/0 pointer-events-none rounded-xl"></div>

    <div class="px-5 pt-5 pb-5 relative z-10 flex flex-col h-full">
      <header class="flex justify-between items-start mb-1">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Ringkasan Keuangan</h2>
      </header>
      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-4 tracking-wider">
        Periode: {{ monthName }}
      </div>

      <div class="flex flex-col gap-3 flex-1 justify-between">
        
        <!-- Pemasukan -->
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50/30 dark:from-green-900/30 dark:to-emerald-900/10 rounded-xl border border-green-100/50 dark:border-green-800/30 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
          <div class="flex items-center gap-3">
             <div class="p-2.5 bg-green-100 dark:bg-green-800/80 rounded-lg text-green-600 dark:text-green-300 shadow-inner">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
             </div>
             <div>
                <div class="text-[11px] font-bold text-green-800/70 dark:text-green-400/80 uppercase tracking-widest mb-0.5">Pemasukan</div>
                <div class="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight leading-none">{{ formatCurrency(totalIncome) }}</div>
             </div>
          </div>
          <div class="text-right flex flex-col items-end justify-center group relative">
             <div v-if="momIncome !== null" 
                  class="text-xs font-bold flex items-center cursor-help px-2 py-1 rounded-md transition-colors" 
                  :class="momIncome >= 0 ? 'text-green-600 bg-green-100/50 dark:text-green-400 dark:bg-green-900/30' : 'text-red-500 bg-red-100/50 dark:text-red-400 dark:bg-red-900/30'"
                  data-tip="((Bulan Ini - Bulan Lalu) / Bulan Lalu) × 100%">
               <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="momIncome >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
               {{ Math.abs(momIncome) }}%
             </div>
             <div v-else class="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Bulan lalu kosong</div>

             <!-- Tooltip (Custom without daisyUI to guarantee it works gracefully) -->
             <div class="absolute bottom-full right-0 mb-2 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
               <div class="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-medium py-1.5 px-3 rounded-md shadow-xl">
                 Rumus: ((Bulan Ini - Bulan Lalu) / Bulan Lalu) × 100%
                 <div class="absolute -bottom-1 right-3 w-2 h-2 bg-gray-900 dark:bg-gray-100 transform rotate-45"></div>
               </div>
             </div>
          </div>
        </div>

        <!-- Pengeluaran -->
        <div class="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-red-50/30 dark:from-rose-900/30 dark:to-red-900/10 rounded-xl border border-red-100/50 dark:border-red-800/30 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
          <div class="flex items-center gap-3">
             <div class="p-2.5 bg-red-100 dark:bg-red-800/80 rounded-lg text-red-600 dark:text-red-300 shadow-inner">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
             </div>
             <div>
                <div class="text-[11px] font-bold text-red-800/70 dark:text-red-400/80 uppercase tracking-widest mb-0.5">Pengeluaran</div>
                <div class="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight leading-none">{{ formatCurrency(totalSpent) }}</div>
             </div>
          </div>
          <div class="text-right flex flex-col items-end justify-center group relative">
             <div v-if="momSpent !== null" 
                  class="text-xs font-bold flex items-center cursor-help px-2 py-1 rounded-md transition-colors" 
                  :class="momSpent <= 0 ? 'text-green-600 bg-green-100/50 dark:text-green-400 dark:bg-green-900/30' : 'text-red-500 bg-red-100/50 dark:text-red-400 dark:bg-red-900/30'"
                  data-tip="((Bulan Ini - Bulan Lalu) / Bulan Lalu) × 100%">
               <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="momSpent >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
               {{ Math.abs(momSpent) }}%
             </div>
             <div v-else class="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Bulan lalu kosong</div>

             <!-- Tooltip (Custom) -->
             <div class="absolute bottom-full right-0 mb-2 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
               <div class="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-[10px] font-medium py-1.5 px-3 rounded-md shadow-xl">
                 Rumus: ((Bulan Ini - Bulan Lalu) / Bulan Lalu) × 100%
                 <div class="absolute -bottom-1 right-3 w-2 h-2 bg-gray-900 dark:bg-gray-100 transform rotate-45"></div>
               </div>
             </div>
          </div>
        </div>

        <!-- Sisa Uang -->
        <div class="flex items-center justify-between p-4 bg-gray-50/80 dark:bg-gray-900/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60 transition-all hover:shadow-md hover:-translate-y-0.5">
          <div>
              <div class="text-[11px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-widest mb-0.5">Sisa Kantong</div>
              <div class="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight leading-none">{{ formatCurrency(totalRemaining) }}</div>
          </div>
          <!-- Unallocated Info -->
          <div v-if="unallocated > 0" class="flex flex-col items-end text-amber-600 dark:text-amber-400">
              <div class="flex items-center gap-1 mb-1 opacity-90">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                <span class="text-[10px] font-bold uppercase tracking-wider">Sisa Gaji (Unallocated)</span>
              </div>
              <span class="text-sm font-bold bg-amber-100 dark:bg-amber-900/40 px-2.5 py-0.5 rounded-md">{{ formatCurrency(unallocated) }}</span>
          </div>
          <div v-else-if="unallocated === 0 && totalRemaining >= 0" class="flex flex-col items-end text-emerald-600 dark:text-emerald-400 opacity-80">
              <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <span class="text-[10px] font-bold uppercase tracking-wider text-right max-w-[100px] leading-tight">Semua gaji telah dialokasikan</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>