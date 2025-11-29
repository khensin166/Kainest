<!-- BudgetHeroCard.vue -->
<script setup>
import DailyTrendSparkline from './DailyTrendSparkline.vue';

const props = defineProps({
  totalRemaining: {
    type: Number,
    required: true,
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

const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
</script>

<template>
  <div
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-100 dark:border-gray-700/60 overflow-hidden">

    <div class="px-5 pt-5 pb-1">
      <header class="flex justify-between items-start mb-1">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Sisa Uang Harian</h2>
      </header>
      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-2">
        Periode: {{ monthName }}
      </div>
      <div class="flex items-start">
        <div class="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100 mr-2 tracking-tight truncate">
          {{ formatCurrency(totalRemaining) }}
        </div>
      </div>
    </div>

    <div class="mt-auto h-16 w-full relative">

      <div v-if="!trendData"
        class="absolute inset-0 flex items-center justify-center bg-green-50/50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs animate-pulse font-medium">
        Memuat grafik tren...
      </div>

      <DailyTrendSparkline v-else class="w-full h-full" :chartData="{
        ...trendData,
        datasets: trendData.datasets.map(ds => ({
          ...ds,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 1.5,
        }))
      }" />
    </div>
  </div>
</template>