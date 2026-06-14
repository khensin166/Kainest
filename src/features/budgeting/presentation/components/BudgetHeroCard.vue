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

    <div class="px-5 pt-5 pb-4 relative z-10">
      <header class="flex justify-between items-start mb-1">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Ringkasan Keuangan</h2>
      </header>
      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-4 tracking-wider">
        Periode: {{ monthName }}
      </div>

      <!-- Grid for Income and Expense -->
      <div class="grid grid-cols-2 gap-4 mb-5">
        <!-- Pemasukan -->
        <div class="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 rounded-xl border border-green-100/50 dark:border-green-800/30 shadow-sm transition-transform hover:-translate-y-0.5">
          <div class="flex items-center gap-2 mb-1.5">
            <div class="p-1.5 bg-green-100 dark:bg-green-800 rounded-lg text-green-600 dark:text-green-300 shadow-inner">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
            </div>
            <span class="text-xs font-semibold text-green-800 dark:text-green-300 uppercase tracking-wide">Pemasukan</span>
          </div>
          <div class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight truncate">{{ formatCurrency(totalIncome) }}</div>
          <div v-if="momIncome !== null" class="text-xs mt-1.5 font-medium flex items-center" :class="momIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
             <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="momIncome >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
             {{ Math.abs(momIncome) }}% vs bulan lalu
          </div>
          <div v-else class="text-[10px] mt-1.5 text-gray-400 dark:text-gray-500 font-medium">Bulan lalu tidak ada data</div>
        </div>

        <!-- Pengeluaran -->
        <div class="p-3 bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-900/30 dark:to-red-900/20 rounded-xl border border-red-100/50 dark:border-red-800/30 shadow-sm transition-transform hover:-translate-y-0.5">
           <div class="flex items-center gap-2 mb-1.5">
            <div class="p-1.5 bg-red-100 dark:bg-red-800 rounded-lg text-red-600 dark:text-red-300 shadow-inner">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            </div>
            <span class="text-xs font-semibold text-red-800 dark:text-red-300 uppercase tracking-wide">Pengeluaran</span>
          </div>
          <div class="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight truncate">{{ formatCurrency(totalSpent) }}</div>
          <div v-if="momSpent !== null" class="text-xs mt-1.5 font-medium flex items-center" :class="momSpent <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
             <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="momSpent >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
             {{ Math.abs(momSpent) }}% vs bulan lalu
          </div>
          <div v-else class="text-[10px] mt-1.5 text-gray-400 dark:text-gray-500 font-medium">Bulan lalu tidak ada data</div>
        </div>
      </div>

      <!-- Sisa Uang & Unallocated -->
      <div class="bg-gray-50/80 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
        <div class="flex items-center justify-between">
          <div>
              <div class="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Sisa Kantong</div>
              <div class="text-2xl font-black text-gray-800 dark:text-gray-100 tracking-tight">{{ formatCurrency(totalRemaining) }}</div>
          </div>
          <!-- Unallocated Info -->
          <div v-if="unallocated > 0" class="flex flex-col items-end text-amber-600 dark:text-amber-400">
              <div class="flex items-center gap-1 mb-1 opacity-90">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                <span class="text-[10px] font-bold uppercase tracking-wider">Sisa Gaji (Unallocated)</span>
              </div>
              <span class="text-sm font-bold bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-md">{{ formatCurrency(unallocated) }}</span>
          </div>
          <div v-else-if="unallocated === 0 && totalRemaining >= 0" class="flex flex-col items-end text-emerald-600 dark:text-emerald-400 opacity-80">
              <svg class="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              <span class="text-[10px] font-bold uppercase tracking-wider text-right max-w-[100px]">Semua gaji telah dialokasikan</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>