<!-- BudgetCategoryCard.vue -->
<script setup>
import { computed, ref } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';

// Menerima satu objek entity kategori utuh
const props = defineProps({
  category: {
    type: Object, // Tipe: BudgetSummaryEntity
    required: true,
  },
});

const budgetStore = useBudgetStore();
const formatCurrency = (value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

// State lokal untuk mengontrol apakah saran AI sedang dibuka/ditutup
const isAiExpanded = ref(false);
const isLoadingAiLocally = ref(false);

// Computed untuk warna dinamis berdasarkan status zona (dari Entity)
const statusTheme = computed(() => {
  const zone = props.category.zone || 'GREEN'; // Default Green jika belum ada data AI
  if (zone === 'RED' || props.category.status === 'OVERBUDGET') {
    return { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', bar: 'bg-red-500' };
  }
  if (zone === 'YELLOW' || props.category.status === 'WARNING') {
    return { bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', bar: 'bg-yellow-500' };
  }
  // Default Green/Safe
  return { bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', bar: 'bg-green-500' };
});

// Handle klik untuk minta saran AI
const toggleAiAdvice = async () => {
  // Jika sudah ada saran, tinggal toggle tampilan
  if (props.category.aiAdvice) {
    isAiExpanded.value = !isAiExpanded.value;
    return;
  }

  // Jika belum ada, tarik dari API via Store
  isLoadingAiLocally.value = true;
  isAiExpanded.value = true; // Buka panelnya dulu biar kelihatan loading
  await budgetStore.fetchAiAdviceForCategory(props.category.categoryId);
  isLoadingAiLocally.value = false;
};
</script>

<template>
  <div 
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60 transition-all duration-200 hover:shadow-md"
    :class="statusTheme.bg"
  >
    <div class="px-5 pt-5 pb-3">
      <header class="flex justify-between items-start mb-2">
        <div class="flex items-center">
          <span class="text-2xl mr-2">{{ category.icon }}</span>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {{ category.categoryName }}
          </h2>
        </div>
        
        <button 
          @click="toggleAiAdvice"
          class="text-xs font-medium flex items-center py-1 px-2 rounded-full transition-colors"
          :class="[statusTheme.text, isAiExpanded ? 'bg-white dark:bg-gray-800 shadow-sm' : 'hover:bg-white dark:hover:bg-gray-800']"
        >
          <span v-if="category.zone" class="mr-1">
            {{ category.zone === 'GREEN' ? '🟢 Aman' : category.zone === 'YELLOW' ? '🟡 Waspada' : '🔴 Bahaya' }}
          </span>
          <span v-else>🤖 Analisis AI</span>
        </button>
      </header>

      <div class="flex items-baseline my-3">
        <div class="text-2xl font-bold text-gray-800 dark:text-gray-100 mr-2">
          Sisa: {{ formatCurrency(category.remaining) }}
        </div>
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400">
          dari {{ formatCurrency(category.limit) }}
        </div>
      </div>

       <div class="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-1">
        <div 
          class="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
          :class="statusTheme.bar"
          :style="{ width: `${Math.min(category.percentageUsed, 100)}%` }"
        ></div>
      </div>
      <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>Terpakai: {{ formatCurrency(category.spent) }}</span>
        <span :class="statusTheme.text" class="font-semibold">{{ category.percentageUsed }}%</span>
      </div>

      <div v-if="isAiExpanded" class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm transition-all duration-300">
        <div v-if="isLoadingAiLocally" class="flex items-center text-gray-500 animate-pulse">
          <span class="mr-2">🤖</span> Sedang menganalisis kebiasaanmu...
        </div>
        <div v-else-if="category.aiAdvice" class="flex items-start">
          <span class="text-lg mr-2">💡</span>
          <p class="text-gray-700 dark:text-gray-300 leading-relaxed italic">
            "{{ category.aiAdvice }}"
          </p>
        </div>
      </div>

    </div>
  </div>
</template>