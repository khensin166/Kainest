<template>
  <div v-if="aiSuggestion" class="ai-suggestion-banner rounded-md bg-surface-card mb-6 shadow-sm border border-border-default overflow-hidden">

    <!-- Banner utama -->
    <div class="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

      <!-- Icon and Content -->
      <div class="flex items-start gap-4 flex-1 min-w-0">
        <div class="flex-shrink-0 w-11 h-11 bg-ai-soft rounded-full flex items-center justify-center border border-ai">
          <IconBolt class="h-5 w-5 text-ai" aria-hidden="true" />
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-text-primary font-semibold text-base mb-1 flex items-center gap-2 flex-wrap">
            Rekomendasi Budget AI
            <span class="px-2 py-0.5 rounded-full bg-ai-soft border border-ai text-ai text-xs font-medium">Bulan Ini</span>
          </h3>
          <p class="text-text-muted text-sm leading-relaxed">
            {{ aiSuggestion.insightText }}
          </p>

          <!-- Pocket Changes Preview Tags -->
          <div v-if="changedPockets.length" class="mt-2.5 flex flex-wrap gap-1.5">
            <span v-for="pocket in changedPockets.slice(0, 3)" :key="pocket.categoryId"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-subtle border border-border-default text-xs text-text-secondary">
              {{ pocket.categoryName }}
              <span :class="pocket.action === 'INCREASE' ? 'text-status-danger' : 'text-status-success'">
                <IconArrowUp class="h-3 w-3" aria-hidden="true" />
                <IconArrowDown class="h-3 w-3" aria-hidden="true" />
              </span>
            </span>
            <span v-if="changedPockets.length > 3" class="inline-flex items-center px-2.5 py-1 rounded-md bg-surface-subtle border border-border-default text-xs text-text-muted">
              +{{ changedPockets.length - 3 }} lainnya
            </span>

            <!-- Toggle detail -->
            <button @click="showDetails = !showDetails"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-brand-primary hover:bg-surface-hover transition-colors">
              <IconChevronDown class="h-3 w-3 transition-transform" aria-hidden="true" />
              {{ showDetails ? 'Sembunyikan Detail' : 'Lihat Detail' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex-shrink-0 w-full sm:w-auto flex flex-col sm:items-end gap-1.5">
        <button
          @click="handleApply"
          :disabled="isApplying"
          class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-text-inverse font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Spinner class="h-4 w-4 text-text-inverse" />
          <IconCheck class="h-4 w-4" aria-hidden="true" />
          {{ isApplying ? 'Menerapkan...' : 'Apply 1-Click' }}
        </button>
        <button
          @click="handleDismiss"
          :disabled="isApplying || isDismissing"
          class="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-status-danger hover:bg-status-danger-bg text-status-danger-text font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Spinner class="h-4 w-4" />
          <IconClose class="h-4 w-4" aria-hidden="true" />
          {{ isDismissing ? 'Mengabaikan...' : 'Abaikan' }}
        </button>
        <p class="text-xs text-text-muted text-center sm:text-right mt-1.5">
          Otomatis update limit kantongmu
        </p>
      </div>
    </div>

    <!-- Detail Panel (toggle) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[600px]"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 max-h-[600px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="showDetails && changedPockets.length" class="border-t border-border-default overflow-hidden">
        <div class="px-4 sm:px-5 py-3 space-y-2.5">
          <p class="text-xs font-semibold text-text-muted mb-1">Rincian Perubahan</p>
          <div v-for="pocket in changedPockets" :key="pocket.categoryId"
               class="flex items-start justify-between gap-3 p-3 rounded-lg bg-surface-subtle border border-border-default">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span :class="pocket.action === 'INCREASE' ? 'bg-status-danger-bg text-status-danger-text border-status-danger' : 'bg-status-success-bg text-status-success-text border-status-success'"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold border">
                  <IconArrowUp class="h-2.5 w-2.5" aria-hidden="true" />
                  <IconArrowDown class="h-2.5 w-2.5" aria-hidden="true" />
                  {{ pocket.action === 'INCREASE' ? 'Naik' : 'Turun' }}
                </span>
                <span class="text-sm font-semibold text-text-primary truncate">{{ pocket.categoryName }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-text-muted font-medium">{{ formatRp(pocket.currentLimit) }}</span>
                <IconArrowRight class="h-3.5 w-3.5 text-text-muted flex-shrink-0" aria-hidden="true" />
                <span :class="pocket.action === 'INCREASE' ? 'text-status-danger' : 'text-status-success'" class="font-bold">{{ formatRp(pocket.newLimitAmount) }}</span>
              </div>
              <p class="mt-1 text-xs text-text-muted leading-relaxed">{{ pocket.reason }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Spinner } from '@/ui';
import { IconArrowDown, IconArrowRight, IconArrowUp, IconBolt, IconCheck, IconChevronDown, IconClose } from '@/ui/icons';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useBudgetStore } from '../stores/useBudgetStore';
import { toast } from 'vue3-toastify';

const budgetStore = useBudgetStore();
const { aiSuggestion, isApplyingSuggestion, isDismissingSuggestion } = storeToRefs(budgetStore);

const isApplying = computed(() => isApplyingSuggestion.value);
const isDismissing = computed(() => isDismissingSuggestion.value);
const showDetails = ref(false);

const changedPockets = computed(() =>
  (aiSuggestion.value?.proposedPockets ?? []).filter(p => p.action !== 'KEEP')
);

const formatRp = (val) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val ?? 0);

const handleApply = async () => {
  if (!aiSuggestion.value?.id) return;
  const result = await budgetStore.applyAiSuggestion(aiSuggestion.value.id);
  if (result.success) {
    showDetails.value = false;
    toast.success(`Berhasil menerapkan ${result.data.appliedCount} rekomendasi budget dari AI!`);
  } else {
    toast.error(result.message || 'Gagal menerapkan rekomendasi budget.');
  }
};

const handleDismiss = async () => {
  if (!aiSuggestion.value?.id) return;
  const result = await budgetStore.dismissAiSuggestion(aiSuggestion.value.id);
  if (result.success) {
    showDetails.value = false;
    toast.success(`Saran AI diabaikan.`);
  } else {
    toast.error(result.message || 'Gagal mengabaikan rekomendasi budget.');
  }
};
</script>

<style scoped>
.ai-suggestion-banner {
  animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
