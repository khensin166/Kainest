<template>
  <div v-if="aiSuggestion" class="ai-suggestion-banner rounded-xl bg-white dark:bg-gray-800 mb-6 shadow-sm border border-gray-100 dark:border-gray-700/60 overflow-hidden">

    <!-- Banner utama -->
    <div class="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

      <!-- Icon and Content -->
      <div class="flex items-start gap-4 flex-1 min-w-0">
        <div class="flex-shrink-0 w-11 h-11 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center border border-violet-200 dark:border-violet-800/50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-gray-800 dark:text-gray-100 font-semibold text-base mb-1 flex items-center gap-2 flex-wrap">
            Rekomendasi Budget AI
            <span class="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800/50 text-violet-700 dark:text-violet-300 text-xs font-medium">Bulan Ini</span>
          </h3>
          <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            {{ aiSuggestion.insightText }}
          </p>

          <!-- Pocket Changes Preview Tags -->
          <div v-if="changedPockets.length" class="mt-2.5 flex flex-wrap gap-1.5">
            <span v-for="pocket in changedPockets.slice(0, 3)" :key="pocket.categoryId"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300">
              {{ pocket.categoryName }}
              <span :class="pocket.action === 'INCREASE' ? 'text-red-500 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                <svg v-if="pocket.action === 'INCREASE'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </span>
            </span>
            <span v-if="changedPockets.length > 3" class="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400">
              +{{ changedPockets.length - 3 }} lainnya
            </span>

            <!-- Toggle detail -->
            <button @click="showDetails = !showDetails"
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 transition-transform" :class="showDetails ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
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
          class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm shadow-violet-600/20"
        >
          <svg v-if="isApplying" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          {{ isApplying ? 'Menerapkan...' : 'Apply 1-Click' }}
        </button>
        <button
          @click="handleDismiss"
          :disabled="isApplying || isDismissing"
          class="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-medium text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <svg v-if="isDismissing" class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          {{ isDismissing ? 'Mengabaikan...' : 'Abaikan' }}
        </button>
        <p class="text-xs text-gray-500 dark:text-gray-400 text-center sm:text-right mt-1.5">
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
      <div v-if="showDetails && changedPockets.length" class="border-t border-gray-100 dark:border-gray-700/60 overflow-hidden">
        <div class="px-4 sm:px-5 py-3 space-y-2.5">
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Rincian Perubahan</p>
          <div v-for="pocket in changedPockets" :key="pocket.categoryId"
               class="flex items-start justify-between gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700/40">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span :class="pocket.action === 'INCREASE'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50'"
                  class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-semibold border">
                  <svg v-if="pocket.action === 'INCREASE'" xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  {{ pocket.action === 'INCREASE' ? 'Naik' : 'Turun' }}
                </span>
                <span class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{{ pocket.categoryName }}</span>
              </div>
              <div class="flex items-center gap-2 text-sm">
                <span class="text-gray-500 dark:text-gray-400 font-medium">{{ formatRp(pocket.currentLimit) }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span :class="pocket.action === 'INCREASE' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'" class="font-bold">{{ formatRp(pocket.newLimitAmount) }}</span>
              </div>
              <p class="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{{ pocket.reason }}</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
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
