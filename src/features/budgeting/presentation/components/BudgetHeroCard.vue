<!-- BudgetHeroCard.vue -->
<script setup>
import DailyTrendSparkline from './DailyTrendSparkline.vue';
import { formatRupiah as formatCurrency } from '@/utils/Utils';

const props = defineProps({
  totalRemaining: {
    type: Number,
    required: true,
  },
  totalSalary: {
    type: Number,
    default: 0,
  },
  totalIncome: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  momSalary: {
    type: Number,
    default: null,
  },
  momIncome: {
    type: Number,
    default: null,
  },
  momSpent: {
    type: Number,
    default: null,
  },
  momRemaining: {
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

      <div class="flex flex-col gap-4 flex-1">
        
        <!-- Sisa Kantong (Hero Number) -->
        <div class="flex flex-col items-center justify-center p-6 bg-gray-50/80 dark:bg-gray-900/50 rounded-xl border border-gray-200/60 dark:border-gray-700/60 shadow-inner text-center">
          <div class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
            Sisa Gaji Pokok
          </div>
          <div class="text-3xl sm:text-4xl font-black text-gray-800 dark:text-gray-100 tracking-tight leading-none mb-3">
            {{ formatCurrency(totalRemaining) }}
          </div>
          
          <div class="flex flex-wrap items-center justify-center gap-2">
            <!-- MoM Badge for Remaining -->
            <div v-if="momRemaining !== null" 
                 class="text-xs font-bold flex items-center cursor-help px-2 py-1 rounded-md transition-colors shadow-sm" 
                 :class="momRemaining >= 0 ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/40 border border-green-200 dark:border-green-800/50' : 'text-red-500 bg-red-100 dark:text-red-400 dark:bg-red-900/40 border border-red-200 dark:border-red-800/50'"
                 data-tip="MoM Sisa Gaji Pokok">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="momRemaining >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
              {{ Math.abs(momRemaining) }}% vs bulan lalu
            </div>
            
            <!-- Unallocated Info -->
            <div v-if="unallocated > 0" class="text-xs font-bold flex items-center px-2 py-1 rounded-md text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800/50 shadow-sm">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              {{ formatCurrency(unallocated) }} belum dialokasikan
            </div>
          </div>
        </div>

        <!-- 3-Column Grid for Secondary Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <!-- Gaji Utama -->
          <div class="flex flex-col p-3 bg-gradient-to-br from-indigo-50/50 to-blue-50/30 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-lg border border-indigo-100/50 dark:border-indigo-800/30 transition-all hover:shadow-sm">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-1.5 bg-indigo-100 dark:bg-indigo-800/60 rounded text-indigo-600 dark:text-indigo-300">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div class="text-[10px] font-bold text-indigo-800/70 dark:text-indigo-400/80 uppercase tracking-wider">Gaji Utama</div>
            </div>
            <div class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">{{ formatCurrency(totalSalary) }}</div>
            <div v-if="momSalary !== null" class="text-[10px] font-bold flex items-center" :class="momSalary >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="momSalary >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
              {{ Math.abs(momSalary) }}%
            </div>
          </div>

          <!-- Pemasukan Tambahan -->
          <div class="flex flex-col p-3 bg-gradient-to-br from-violet-50/50 to-fuchsia-50/30 dark:from-violet-900/20 dark:to-fuchsia-900/10 rounded-lg border border-violet-100/50 dark:border-violet-800/30 transition-all hover:shadow-sm">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-1.5 bg-violet-100 dark:bg-violet-800/60 rounded text-violet-600 dark:text-violet-300">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <div class="text-[10px] font-bold text-violet-800/70 dark:text-violet-400/80 uppercase tracking-wider">Tambahan</div>
            </div>
            <div class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">{{ formatCurrency(totalIncome) }}</div>
            <div v-if="momIncome !== null" class="text-[10px] font-bold flex items-center" :class="momIncome >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="momIncome >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
              {{ Math.abs(momIncome) }}%
            </div>
          </div>

          <!-- Pengeluaran -->
          <div class="flex flex-col p-3 bg-gradient-to-br from-rose-50/50 to-red-50/30 dark:from-rose-900/20 dark:to-red-900/10 rounded-lg border border-red-100/50 dark:border-red-800/30 transition-all hover:shadow-sm">
            <div class="flex items-center gap-2 mb-2">
              <div class="p-1.5 bg-red-100 dark:bg-red-800/60 rounded text-red-600 dark:text-red-300">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
              </div>
              <div class="text-[10px] font-bold text-red-800/70 dark:text-red-400/80 uppercase tracking-wider">Pengeluaran</div>
            </div>
            <div class="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">{{ formatCurrency(totalSpent) }}</div>
            <div v-if="momSpent !== null" class="text-[10px] font-bold flex items-center" :class="momSpent <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'">
              <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="momSpent >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
              {{ Math.abs(momSpent) }}%
            </div>
          </div>

        </div>

      </div>
    </div>
  </div>
</template>