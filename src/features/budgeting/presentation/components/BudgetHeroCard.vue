<!-- BudgetHeroCard.vue -->
<script setup>
import { ref } from 'vue';
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
    default: null,
  }
});

// Mobile expand/collapse state for secondary stats
const isDetailsExpanded = ref(false);
</script>

<template>
  <div
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-surface-card shadow-xs rounded-xl border border-border-default overflow-hidden relative">

    <!-- Glassmorphism sheen — otomatis dinonaktifkan oleh .theme-factory override -->
    <div class="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/5 dark:to-white/0 pointer-events-none rounded-xl"></div>

    <div class="px-5 pt-5 pb-5 relative z-10 flex flex-col h-full">
      <header class="flex justify-between items-start mb-1">
        <h2 class="text-lg font-semibold text-text-primary">Ringkasan Keuangan</h2>
      </header>
      <div class="text-xs font-semibold text-text-faint uppercase mb-4 tracking-wider">
        Periode: {{ monthName }}
      </div>

      <div class="flex flex-col gap-3 flex-1">

        <!-- [ROW 1] Sisa Gaji Pokok (Hero Number) -->
        <div class="flex flex-col items-center justify-center px-4 py-5 bg-surface-subtle rounded-xl border border-border-default text-center">
          <div class="text-xs font-bold text-text-muted uppercase tracking-widest mb-1">
            Sisa Gaji Pokok
          </div>
          <div class="text-3xl font-black text-text-primary tracking-tight leading-none mb-3">
            {{ formatCurrency(totalRemaining) }}
          </div>
          <div class="flex flex-wrap items-center justify-center gap-2">
            <!-- MoM Remaining Badge -->
            <div v-if="momRemaining !== null"
                 class="text-xs font-bold flex items-center px-2 py-1 rounded-md border"
                 :class="momRemaining >= 0
                   ? 'text-status-success-text bg-status-success-bg border-status-success/30'
                   : 'text-status-danger-text bg-status-danger-bg border-status-danger/30'">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" :d="momRemaining >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
              {{ Math.abs(momRemaining) }}% vs bulan lalu
            </div>
            <!-- Unallocated Badge -->
            <div v-if="unallocated > 0" class="text-xs font-bold flex items-center px-2 py-1 rounded-md text-status-warning-text bg-status-warning-bg border border-status-warning/30">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
              {{ formatCurrency(unallocated) }} belum dialokasikan
            </div>
          </div>
        </div>

        <!-- [ROW 2] Pengeluaran — full width, always visible -->
        <div class="flex items-center justify-between p-3.5 bg-status-danger-bg rounded-xl border border-status-danger/20 transition-all">
          <div class="flex items-center gap-2.5">
            <div class="p-1.5 bg-status-danger-bg rounded-lg text-status-danger">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg>
            </div>
            <div>
              <div class="text-[10px] font-bold text-status-danger-text uppercase tracking-widest">Pengeluaran Bulan Ini</div>
              <div class="text-base font-bold text-text-primary tracking-tight">{{ formatCurrency(totalSpent) }}</div>
            </div>
          </div>
          <div v-if="momSpent !== null"
               class="text-xs font-bold flex items-center px-2 py-1 rounded-md"
               :class="momSpent <= 0
                 ? 'text-status-success-text bg-status-success-bg'
                 : 'text-status-danger-text bg-status-danger-bg'">
            <svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="momSpent >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
            {{ Math.abs(momSpent) }}%
          </div>
        </div>

        <!-- [ROW 3] Gaji Utama + Pemasukan Tambahan (Grid 2 cols) -->
        <!-- On desktop: always visible. On mobile: hidden unless expanded. -->
        <div class="grid grid-cols-2 gap-3 transition-all duration-300"
             :class="isDetailsExpanded ? 'block' : 'hidden sm:grid'">

          <!-- Gaji Utama -->
          <div class="flex flex-col p-3 bg-surface-subtle rounded-lg border border-border-default transition-all min-w-0">
            <div class="flex items-center gap-1.5 mb-2">
              <div class="p-1 bg-surface-hover rounded text-brand-primary shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div class="text-[10px] font-bold text-text-muted uppercase tracking-wide truncate">Gaji Utama</div>
            </div>
            <div class="text-sm font-bold text-text-primary mb-1 truncate">{{ formatCurrency(totalSalary) }}</div>
            <div v-if="momSalary !== null" class="text-[10px] font-bold flex items-center"
                 :class="momSalary >= 0 ? 'text-status-success' : 'text-status-danger'">
              <svg class="w-3 h-3 mr-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="momSalary >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
              {{ Math.abs(momSalary) }}%
            </div>
          </div>

          <!-- Pemasukan Tambahan -->
          <div class="flex flex-col p-3 bg-surface-subtle rounded-lg border border-border-default transition-all min-w-0">
            <div class="flex items-center gap-1.5 mb-2">
              <div class="p-1 bg-surface-hover rounded text-brand-muted shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              </div>
              <div class="text-[10px] font-bold text-text-muted uppercase tracking-wide truncate">Tambahan</div>
            </div>
            <div class="text-sm font-bold text-text-primary mb-1 truncate">{{ formatCurrency(totalIncome) }}</div>
            <div v-if="momIncome !== null" class="text-[10px] font-bold flex items-center"
                 :class="momIncome >= 0 ? 'text-status-success' : 'text-status-danger'">
              <svg class="w-3 h-3 mr-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="momIncome >= 0 ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'"></path></svg>
              {{ Math.abs(momIncome) }}%
            </div>
          </div>
        </div>

        <!-- Mobile Expand/Collapse Toggle (hidden on desktop) -->
        <button
          @click="isDetailsExpanded = !isDetailsExpanded"
          class="sm:hidden flex items-center justify-center gap-1.5 w-full py-1.5 text-[11px] font-semibold text-text-faint hover:text-text-muted transition-colors">
          <span>{{ isDetailsExpanded ? 'Sembunyikan rincian' : 'Lihat rincian gaji' }}</span>
          <svg class="w-3.5 h-3.5 transition-transform duration-300" :class="isDetailsExpanded ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>

      </div>
    </div>
  </div>
</template>