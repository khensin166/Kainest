<template>
  <div v-if="aiSuggestion" class="ai-suggestion-banner rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-1 mb-6 shadow-lg shadow-blue-900/20">
    <div class="bg-gray-900/80 backdrop-blur-md rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      
      <!-- Icon and Content -->
      <div class="flex items-start gap-4 flex-1">
        <div class="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <div class="flex-1 min-w-0">
          <h3 class="text-white font-semibold text-base sm:text-lg mb-1 flex items-center gap-2">
            Rekomendasi Budget AI
            <span class="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium">Bulan Ini</span>
          </h3>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-none">
            {{ aiSuggestion.insightText }}
          </p>
          
          <!-- Pocket Changes Preview -->
          <div v-if="aiSuggestion.proposedPockets?.length" class="mt-3 flex flex-wrap gap-2">
            <span v-for="pocket in aiSuggestion.proposedPockets.filter(p => p.action !== 'KEEP').slice(0, 3)" :key="pocket.categoryId" 
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-800 border border-gray-700 text-xs text-gray-300">
              {{ pocket.categoryName }}
              <span :class="pocket.action === 'INCREASE' ? 'text-red-400' : 'text-green-400'">
                <svg v-if="pocket.action === 'INCREASE'" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </span>
            </span>
            <span v-if="aiSuggestion.proposedPockets.filter(p => p.action !== 'KEEP').length > 3" class="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-800 border border-gray-700 text-xs text-gray-400">
              +{{ aiSuggestion.proposedPockets.filter(p => p.action !== 'KEEP').length - 3 }} lainnya
            </span>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex-shrink-0 w-full sm:w-auto flex flex-col sm:items-end gap-2">
        <button 
          @click="handleApply" 
          :disabled="isApplying"
          class="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed border border-blue-500/50"
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
        <p class="text-xs text-gray-400 text-center sm:text-right px-1">
          Otomatis update limit kantongmu
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useToast } from 'vue-toastification';

const toast = useToast();
const budgetStore = useBudgetStore();
const { aiSuggestion, isApplyingSuggestion } = storeToRefs(budgetStore);

const isApplying = computed(() => isApplyingSuggestion.value);

const handleApply = async () => {
  if (!aiSuggestion.value?.id) return;
  
  const result = await budgetStore.applyAiSuggestion(aiSuggestion.value.id);
  
  if (result.success) {
    toast.success(`Berhasil menerapkan ${result.data.appliedCount} rekomendasi budget dari AI!`);
  } else {
    toast.error(result.message || "Gagal menerapkan rekomendasi budget.");
  }
};
</script>

<style scoped>
.ai-suggestion-banner {
  animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
