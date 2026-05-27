<template>
  <div class="px-5 py-4 w-full max-h-[85vh] overflow-y-auto">
    <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-6">
      Kelola "Kantong" (Pocket) Pengeluaran Anda. Tentukan batas persentase atau nominal untuk tiap kategori.
    </div>

    <!-- Alert / Summary Info -->
    <div class="mb-6 p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-indigo-800 dark:text-indigo-300">Total Persentase Terpakai:</span>
        <span class="text-lg font-bold" :class="totalPercentage > 100 ? 'text-red-600' : 'text-indigo-600 dark:text-indigo-400'">
          {{ totalPercentage }}%
        </span>
      </div>
      <p v-if="totalPercentage > 100" class="text-xs text-red-500 mt-1">
        Total persentase tidak boleh melebihi 100%.
      </p>
    </div>

    <form @submit.prevent="handleSubmit">
      <div class="space-y-6">
        <div v-for="(pocket, index) in pocketsData" :key="index" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <span class="text-xl">{{ getCategoryIcon(pocket.categoryId) }}</span>
              {{ getCategoryName(pocket.categoryId) || 'Pilih Kategori' }}
            </h3>
            <button type="button" @click="removePocket(index)" class="text-red-500 hover:text-red-700 text-sm p-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Pilihan Kategori -->
            <div class="sm:col-span-2 relative">
              <label class="block text-xs font-medium text-gray-500 mb-1">Kategori</label>
              <!-- Gunakan existing component -->
              <DropdownSelect 
                v-model="pocket.categoryId"
                :options="availableCategories.map(c => ({ label: c.icon + ' ' + c.name, value: c.id }))"
                label="Kategori"
                class="w-full"
              />
            </div>

            <!-- Tipe Limit -->
            <div class="relative">
              <label class="block text-xs font-medium text-gray-500 mb-1">Tipe Batas</label>
              <DropdownSelect 
                v-model="pocket.limitType"
                :options="[{label: 'Persentase (%)', value: 'percentage'}, {label: 'Nominal (Rp)', value: 'nominal'}]"
                label="Tipe"
                class="w-full"
              />
            </div>

            <!-- Input Nilai -->
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">
                {{ pocket.limitType === 'percentage' ? 'Persentase (%)' : 'Batas Maksimal (Rp)' }}
              </label>
              <input v-if="pocket.limitType === 'percentage'" v-model.number="pocket.percentage" type="number" min="1" max="100" class="form-input w-full text-sm rounded-lg" placeholder="Contoh: 15" required />
              <input v-else v-model.number="pocket.limitAmount" type="number" min="1000" class="form-input w-full text-sm rounded-lg" placeholder="Contoh: 500000" required />
            </div>
            
            <!-- Kata Kunci Kustom (Optional) -->
            <div class="sm:col-span-2 mt-2">
              <label class="block text-xs font-medium text-gray-500 mb-1">Kata Kunci AI (Pisahkan dengan koma)</label>
              <input v-model="pocket.keywordsInput" type="text" class="form-input w-full text-sm rounded-lg" placeholder="contoh: kfc, gofood, warteg, sate" />
              <p class="text-[10px] text-gray-400 mt-1">AI akan menggunakan kata kunci ini untuk otomatis mengenali pengeluaran Anda.</p>
            </div>
          </div>
        </div>

        <button type="button" @click="addPocket" class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-violet-500 hover:text-violet-600 transition-colors flex items-center justify-center gap-2 font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Tambah Kantong Baru
        </button>
      </div>

      <div class="mt-8 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
        <button type="button" class="btn bg-white dark:bg-gray-800 border-gray-200 text-gray-600" @click="$emit('close')" :disabled="pocketStore.isLoading">
          Batal
        </button>
        <button type="submit" class="btn bg-violet-600 hover:bg-violet-700 text-white" :disabled="pocketStore.isLoading || totalPercentage > 100">
          <span v-if="pocketStore.isLoading">Menyimpan...</span>
          <span v-else>Simpan Kantong</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import { usePocketStore } from '../stores/usePocketStore';
import { useBudgetStore } from '../stores/useBudgetStore';
import { toast } from 'vue3-toastify';
import DropdownSelect from '@/components/forms/DropdownSelect.vue';

const emit = defineEmits(['close']);
const pocketStore = usePocketStore();
const budgetStore = useBudgetStore();

// Default 1 pocket kosong
const pocketsData = ref([]);

onMounted(async () => {
  // Load categories if not loaded
  if (!budgetStore.categoriesList || budgetStore.categoriesList.length === 0) {
    await budgetStore.fetchAllCategories();
  }
  
  // Load existing pockets
  await pocketStore.fetchPockets();
  
  if (pocketStore.pockets.length > 0) {
    // Map from API
    pocketsData.value = pocketStore.pockets.map(p => ({
      categoryId: p.categoryId,
      limitType: p.percentage != null ? 'percentage' : 'nominal',
      percentage: p.percentage || null,
      limitAmount: p.limitAmount || null,
      keywordsInput: (p.category?.keywords || []).join(', ')
    }));
  } else {
    // Empty state
    addPocket();
  }
});

const availableCategories = computed(() => budgetStore.categoriesList || []);

const addPocket = () => {
  pocketsData.value.push({
    categoryId: '',
    limitType: 'percentage',
    percentage: null,
    limitAmount: null,
    keywordsInput: ''
  });
};

const removePocket = (index) => {
  pocketsData.value.splice(index, 1);
};

const isCategorySelected = (catId, currentIndex) => {
  return pocketsData.value.some((p, i) => p.categoryId === catId && i !== currentIndex);
};

const getCategoryName = (id) => {
  const cat = availableCategories.value.find(c => c.id === id);
  return cat ? cat.name : '';
};

const getCategoryIcon = (id) => {
  const cat = availableCategories.value.find(c => c.id === id);
  return cat ? cat.icon : '💼';
};

const totalPercentage = computed(() => {
  return pocketsData.value.reduce((total, pocket) => {
    if (pocket.limitType === 'percentage' && pocket.percentage) {
      return total + Number(pocket.percentage);
    }
    return total;
  }, 0);
});

const handleSubmit = async () => {
  if (totalPercentage.value > 100) {
    toast.error("Total persentase tidak boleh melebihi 100%.");
    return;
  }
  
  // Format payload
  const payload = pocketsData.value.filter(p => p.categoryId).map(p => ({
    categoryId: p.categoryId,
    percentage: p.limitType === 'percentage' ? p.percentage : null,
    limitAmount: p.limitType === 'nominal' ? p.limitAmount : null,
    _keywords: p.keywordsInput // We will extract this to update keywords
  }));

  if (payload.length === 0) {
    toast.error("Minimal harus ada satu kantong yang diisi.");
    return;
  }

  // 1. Bulk Setup Pockets
  const success = await pocketStore.bulkSetupPockets({ pockets: payload });
  
  if (success) {
    // 2. Update keywords if provided
    for (const item of payload) {
      if (item._keywords && item._keywords.trim() !== '') {
        const keywordArray = item._keywords.split(',').map(k => k.trim()).filter(k => k);
        await pocketStore.updateKeywords(item.categoryId, keywordArray);
      }
    }
    
    emit('close');
  }
};
</script>
