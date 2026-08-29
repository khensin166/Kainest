<!-- BudgetCategoryCard.vue -->
<script setup>
import { IconAi, IconIdea } from '@/ui/icons';
import { computed, ref } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { formatRupiah as formatCurrency } from '@/utils/Utils';
import { Card } from '@/ui';

const props = defineProps({
  category: { type: Object, required: true },
});

const budgetStore = useBudgetStore();
const isAiExpanded = ref(false);
const isLoadingAiLocally = ref(false);

/**
 * Status hanya mewarnai SINYAL (titik + bar + persentase), bukan seluruh kartu.
 * Enam kantong sehat tidak boleh jadi enam blok warna.
 */
const status = computed(() => {
  const zone = props.category.zone || 'GREEN';
  if (zone === 'RED' || props.category.status === 'OVERBUDGET') {
    return { label: 'Bahaya',  text: 'text-status-danger',  bar: 'bg-status-danger',  dot: 'bg-status-danger' };
  }
  if (zone === 'YELLOW' || props.category.status === 'WARNING') {
    return { label: 'Waspada', text: 'text-status-warning', bar: 'bg-status-warning', dot: 'bg-status-warning' };
  }
  return { label: 'Aman', text: 'text-status-success', bar: 'bg-status-success', dot: 'bg-status-success' };
});

const toggleAiAdvice = async () => {
  if (props.category.aiAdvice) {
    isAiExpanded.value = !isAiExpanded.value;
    return;
  }
  isLoadingAiLocally.value = true;
  isAiExpanded.value = true;
  await budgetStore.fetchAiAdviceForCategory(props.category.categoryId);
  isLoadingAiLocally.value = false;
};
</script>

<template>
  <Card :padded="false" interactive class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4">
    <div class="p-5">

      <header class="flex items-start justify-between gap-3 mb-4">
        <div class="flex items-center gap-2.5 min-w-0">
          <!-- ikon kantong = emoji pilihan user, bukan ikon UI -->
          <span class="text-xl leading-none shrink-0">{{ category.icon }}</span>
          <h2 class="text-sm font-semibold text-text-primary truncate">{{ category.categoryName }}</h2>
        </div>

        <button
          type="button"
          @click="toggleAiAdvice"
          class="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium rounded-sm px-2 py-1 cursor-pointer transition-colors text-text-muted hover:text-text-primary hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
          :class="{ 'bg-surface-hover text-text-primary': isAiExpanded }"
        >
          <template v-if="category.zone">
            <span class="w-1.5 h-1.5 rounded-full" :class="status.dot" aria-hidden="true" />
            <span :class="status.text">{{ status.label }}</span>
          </template>
          <template v-else>
            🤖 Analisis AI
          </template>
        </button>
      </header>

      <p class="text-2xl font-bold text-text-primary tabular-nums tracking-tight leading-none">
        Sisa: {{ formatCurrency(category.remaining) }}
      </p>
      <p class="text-xs text-text-muted mt-1.5">dari {{ formatCurrency(category.limit) }}</p>

      <div class="mt-4">
        <div class="relative w-full h-1 bg-border-default rounded-full overflow-hidden">
          <div
            class="absolute left-0 top-0 h-full rounded-full transition-all duration-500 ease-out"
            :class="status.bar"
            :style="{ width: `${Math.min(category.percentageUsed, 100)}%` }"
          />
        </div>
        <div class="flex justify-between items-baseline mt-2 text-xs">
          <span class="text-text-muted tabular-nums">Terpakai: {{ formatCurrency(category.spent) }}</span>
          <span class="font-semibold tabular-nums" :class="status.text">{{ category.percentageUsed }}%</span>
        </div>
      </div>

      <div v-if="isAiExpanded" class="mt-4 pt-4 border-t border-border-default text-sm">
        <div v-if="isLoadingAiLocally" class="flex items-center gap-2 text-text-muted animate-pulse">
          <IconAi class="w-4 h-4 shrink-0 text-ai" aria-hidden="true" />
          Sedang menganalisis kebiasaanmu...
        </div>
        <div v-else-if="category.aiAdvice" class="flex items-start gap-2">
          <IconIdea class="w-4 h-4 mt-0.5 shrink-0 text-status-warning" aria-hidden="true" />
          <p class="text-sm text-text-secondary leading-relaxed">"{{ category.aiAdvice }}"</p>
        </div>
      </div>

    </div>
  </Card>
</template>
