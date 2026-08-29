<!-- BudgetCategoryCard.vue -->
<script setup>
import { computed, ref } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { formatRupiah as formatCurrency } from '@/utils/Utils';

// Menerima satu objek entity kategori utuh
const props = defineProps({
  category: {
    type: Object, // Tipe: BudgetSummaryEntity
    required: true,
  },
});

const budgetStore = useBudgetStore();

// State lokal untuk mengontrol apakah saran AI sedang dibuka/ditutup
const isAiExpanded = ref(false);
const isLoadingAiLocally = ref(false);

// Computed untuk warna dinamis berdasarkan status zona — menggunakan alias semantik
const statusTheme = computed(() => {
  const zone = props.category.zone || 'GREEN'; // Default Green jika belum ada data AI
  if (zone === 'RED' || props.category.status === 'OVERBUDGET') {
    return { bg: 'bg-status-danger-bg', text: 'text-status-danger', bar: 'bg-status-danger' };
  }
  if (zone === 'YELLOW' || props.category.status === 'WARNING') {
    return { bg: 'bg-status-warning-bg', text: 'text-status-warning', bar: 'bg-status-warning' };
  }
  // Default Green/Safe
  return { bg: 'bg-status-success-bg', text: 'text-status-success', bar: 'bg-status-success' };
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
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 rounded-xl border border-border-default transition-all duration-200"
    :class="statusTheme.bg"
  >
    <div class="px-5 pt-5 pb-3">
      <header class="flex justify-between items-start mb-2">
        <div class="flex items-center">
          <span class="text-2xl mr-2">{{ category.icon }}</span>
          <h2 class="text-lg font-semibold text-text-primary">
            {{ category.categoryName }}
          </h2>
        </div>
        
        <button 
          @click="toggleAiAdvice"
          class="text-xs font-medium flex items-center py-1 px-2 rounded-full transition-colors"
          :class="[statusTheme.text, isAiExpanded ? 'bg-surface-card' : 'hover:bg-surface-card']"
        >
          <span v-if="category.zone" class="mr-1">
            {{ category.zone === 'GREEN' ? '🟢 Aman' : category.zone === 'YELLOW' ? '🟡 Waspada' : '🔴 Bahaya' }}
          </span>
          <span v-else>🤖 Analisis AI</span>
        </button>
      </header>

      <div class="flex items-baseline my-3">
        <div class="text-2xl font-bold text-text-primary mr-2">
          Sisa: {{ formatCurrency(category.remaining) }}
        </div>
        <div class="text-sm font-medium text-text-muted">
          dari {{ formatCurrency(category.limit) }}
        </div>
      </div>

       <div class="relative w-full h-2 bg-border-default rounded-full overflow-hidden mb-1">
        <div 
          class="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
          :class="statusTheme.bar"
          :style="{ width: `${Math.min(category.percentageUsed, 100)}%` }"
        ></div>
      </div>
      <div class="flex justify-between text-xs text-text-muted mb-3">
        <span>Terpakai: {{ formatCurrency(category.spent) }}</span>
        <span :class="statusTheme.text" class="font-semibold">{{ category.percentageUsed }}%</span>
      </div>

      <div v-if="isAiExpanded" class="mt-4 pt-3 border-t border-border-default text-sm transition-all duration-300">
        <div v-if="isLoadingAiLocally" class="flex items-center text-text-muted animate-pulse">
          <span class="mr-2">🤖</span> Sedang menganalisis kebiasaanmu...
        </div>
        <div v-else-if="category.aiAdvice" class="flex items-start">
          <span class="text-lg mr-2">💡</span>
          <p class="text-text-secondary leading-relaxed italic">
            "{{ category.aiAdvice }}"
          </p>
        </div>
      </div>

    </div>
  </div>
</template>