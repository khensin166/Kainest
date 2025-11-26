<script setup>
const props = defineProps({
  totalRemaining: {
    type: Number,
    required: true,
  },
  monthName: {
    type: String,
    default: 'Bulan Ini',
  },
});

const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
</script>

<template>
  <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-100 dark:border-gray-700/60">
    <div class="px-5 pt-5 pb-5">
      <header class="flex justify-between items-start mb-2">
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">Sisa Uang Harian</h2>
        </header>
      <div class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase mb-1">
        Periode: {{ monthName }}
      </div>
      <div class="flex items-start">
        <div class="text-4xl font-bold text-gray-800 dark:text-gray-100 mr-2 tracking-tight">
          {{ formatCurrency(totalRemaining) }}
        </div>
      </div>
      <div class="mt-4">
        <div class="h-12 bg-green-50 dark:bg-green-900/30 rounded-md flex items-center justify-center text-green-600 text-sm animate-pulse">
          Grafik tren harian akan muncul di sini...
        </div>
      </div>
    </div>
  </div>
</template>