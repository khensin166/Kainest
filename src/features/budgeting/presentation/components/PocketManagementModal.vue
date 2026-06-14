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
      <!-- Blueprint Recommendations — Collapsible -->
      <div class="mb-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        <!-- Toggle Header -->
        <button
          type="button"
          @click="isBlueprintExpanded = !isBlueprintExpanded"
          class="w-full flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            ⚡ Rekomendasi Blueprint Cepat
          </span>
          <svg
            class="w-4 h-4 text-gray-400 transition-transform duration-200"
            :class="{ 'rotate-180': isBlueprintExpanded }"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <!-- Collapsible Content -->
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-48"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 max-h-48"
          leave-to-class="opacity-0 max-h-0"
        >
          <div v-show="isBlueprintExpanded" class="px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" @click="applyBlueprint('503020')" class="p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 text-left transition-all">
                <h4 class="font-medium text-sm text-gray-800 dark:text-gray-200">Aturan 50-30-20</h4>
                <p class="text-xs text-gray-500 mt-1">Ideal: 50% Pokok, 30% Hiburan, 20% Tabungan.</p>
              </button>
              <button type="button" @click="applyBlueprint('hemat')" class="p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 hover:border-violet-400 hover:ring-1 hover:ring-violet-400 text-left transition-all">
                <h4 class="font-medium text-sm text-gray-800 dark:text-gray-200">Mahasiswa Kos (Hemat)</h4>
                <p class="text-xs text-gray-500 mt-1">Fokus: 70% Pokok, 10% Hiburan, 20% Tabungan.</p>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <div class="space-y-6">
        <!-- Loading state saat kategori belum ready -->
        <div v-if="isLoadingCategories" class="flex items-center justify-center py-8 text-gray-400 gap-2">
          <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          <span class="text-sm">Memuat data kategori...</span>
        </div>

        <template v-else>
          <div v-for="(pocket, index) in pocketsData" :key="index" class="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <span class="text-xl">{{ getCategoryIcon(pocket.categoryId) }}</span>
                <span>{{ getCategoryName(pocket.categoryId) || 'Pilih Kategori' }}</span>
              </h3>
              <button type="button" @click="removePocket(index)" class="text-red-500 hover:text-red-700 text-sm p-1">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Pilihan Kategori — pakai @update:modelValue agar bisa intercept untuk konfirmasi -->
              <div class="sm:col-span-2 relative">
                <label class="block text-xs font-medium text-gray-500 mb-0.5">Kategori</label>
                <p class="text-[10px] text-gray-400 mb-2">Pilih kategori pengeluaran (misal: Makanan, Transportasi, atau Tabungan).</p>
                <DropdownSelect
                  :modelValue="pocket.categoryId"
                  :options="availableCategories.map(c => ({ label: c.icon + ' ' + c.name, value: c.id }))"
                  placeholder="Pilih Kategori"
                  label="Kategori"
                  class="w-full"
                  @update:modelValue="onCategoryChange(index, $event)"
                />
              </div>

              <!-- Tipe Limit -->
              <div class="relative">
                <label class="block text-xs font-medium text-gray-500 mb-0.5">Tipe Batas</label>
                <p class="text-[10px] text-gray-400 mb-2 leading-tight">Gunakan "Persentase" untuk alokasi dari gaji bulanan Anda, atau "Nominal" untuk nilai tetap/pasti.</p>
                <DropdownSelect
                  v-model="pocket.limitType"
                  :options="[{label: 'Persentase (%)', value: 'percentage'}, {label: 'Nominal (Rp)', value: 'nominal'}]"
                  label="Tipe"
                  class="w-full"
                />
              </div>

              <!-- Input Nilai -->
              <div class="flex flex-col h-full">
                <label class="block text-xs font-medium text-gray-500 mb-0.5">
                  {{ pocket.limitType === 'percentage' ? 'Persentase (%)' : 'Batas Maksimal (Rp)' }}
                </label>
                <p class="text-[10px] text-gray-400 mb-2 leading-tight">Sesuaikan dengan target atau batas rencana pengeluaran bulanan Anda.</p>
                <div v-if="pocket.limitType === 'percentage'">
                  <input v-model.number="pocket.percentage" type="number" min="1" max="100" class="form-input w-full text-sm rounded-lg" placeholder="Contoh: 15" required />
                  <div class="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    ~ {{ formatRupiah((pocket.percentage / 100) * budgetStore.salary) }}
                  </div>
                </div>
                <input v-else v-model.number="pocket.limitAmount" type="number" min="1000" class="form-input w-full text-sm rounded-lg" placeholder="Contoh: 500000" required />
              </div>

              <!-- Kata Kunci Kustom (Optional) -->
              <div class="sm:col-span-2 mt-2">
                <label class="block text-xs font-medium text-gray-500 mb-0.5">Kata Kunci AI (Pisahkan dengan koma)</label>
                <p class="text-[10px] text-gray-400 mb-2 leading-tight">Bot WhatsApp akan otomatis mendeteksi dan memasukkan pengeluaran ke kantong ini jika Anda mengetik kata kunci tersebut saat mencatat via chat.</p>
                <input v-model="pocket.keywordsInput" type="text" class="form-input w-full text-sm rounded-lg" placeholder="Cth: kfc, gofood, bensin, pulsa" />
              </div>
            </div>
          </div>

          <button type="button" @click="addPocket" class="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:border-violet-500 hover:text-violet-600 transition-colors flex items-center justify-center gap-2 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Tambah Kantong Baru
          </button>

          <!-- Custom Category Form -->
          <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button v-if="!showNewCategoryForm" type="button" @click="showNewCategoryForm = true" class="text-sm font-medium text-violet-600 hover:text-violet-700 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Buat Kategori Kustom Sendiri
            </button>

            <div v-else class="p-4 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/20">
              <h4 class="text-sm font-medium text-violet-800 dark:text-violet-300 mb-3">Buat Kategori Kustom</h4>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-2">
                  <label class="block text-xs font-medium text-gray-500 mb-1">Nama Kategori</label>
                  <input v-model="newCategoryName" type="text" class="form-input w-full text-sm rounded-lg" placeholder="Misal: Uang Kucing" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-500 mb-1">Ikon (Emoji)</label>
                  <input v-model="newCategoryIcon" type="text" class="form-input w-full text-sm rounded-lg text-center" placeholder="🐱" maxlength="2" />
                </div>
              </div>
              <div class="flex justify-end gap-2 mt-3">
                <button type="button" @click="showNewCategoryForm = false" class="text-xs px-3 py-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">Batal</button>
                <button type="button" @click="submitNewCategory" class="text-xs px-3 py-1.5 bg-violet-600 text-white hover:bg-violet-700 rounded-lg transition-colors" :disabled="isCreatingCategory || !newCategoryName || !newCategoryIcon">
                  {{ isCreatingCategory ? 'Menyimpan...' : 'Simpan Kategori' }}
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>

      <div class="mt-8 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
        <button type="button" class="btn bg-white dark:bg-gray-800 border-gray-200 text-gray-600" @click="$emit('close')" :disabled="isSubmitting">
          Batal
        </button>
        <button type="submit" class="btn text-white transition-colors" :class="isSubmitting || totalPercentage > 100 || !hasChanges ? 'bg-gray-400 cursor-not-allowed' : 'bg-violet-600 hover:bg-violet-700'" :disabled="isSubmitting || totalPercentage > 100 || !hasChanges">
          <span v-if="isSubmitting">Menyimpan...</span>
          <span v-else>Simpan Kantong</span>
        </button>
      </div>
    </form>

    <!-- ===================================================== -->
    <!-- KONFIRMASI GANTI KATEGORI — Menggunakan BaseModal -->
    <!-- ===================================================== -->
    <BaseModal 
      :isOpen="confirmDialog.show" 
      @close="cancelCategoryChange" 
      @confirm="confirmCategoryChange" 
      size="sm"
    >
      <template #header>Ganti Kategori?</template>
      <template #body>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Anda akan mengganti kategori kantong ini:</p>

        <!-- Perbandingan Sebelum → Sesudah -->
        <div class="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 mb-5">
          <div class="text-center flex-1">
            <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Sebelum</p>
            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ getCategoryIcon(confirmDialog.oldId) }} {{ getCategoryName(confirmDialog.oldId) || '—' }}
            </p>
          </div>
          <svg class="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          <div class="text-center flex-1">
            <p class="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Sesudah</p>
            <p class="text-sm font-semibold text-violet-600 dark:text-violet-400">
              {{ getCategoryIcon(confirmDialog.newId) }} {{ getCategoryName(confirmDialog.newId) }}
            </p>
          </div>
        </div>

        <p class="text-xs text-gray-400 dark:text-gray-500">
          Perubahan ini baru tersimpan ke database setelah Anda menekan tombol <strong>"Simpan Kantong"</strong>.
        </p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineEmits } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { toast } from 'vue3-toastify';
import DropdownSelect from '@/components/forms/DropdownSelect.vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import { formatRupiah } from '@/utils/Utils';

const emit = defineEmits(['close']);
const budgetStore = useBudgetStore();

// Default kosong
const pocketsData = ref([]);

// Loading state untuk keseluruhan modal
const isLoadingCategories = ref(true);

// Blueprint section collapsible
const isBlueprintExpanded = ref(false);

// Submitting state (terpisah dari isLoadingPockets agar tidak memicu re-render parent)
const isSubmitting = ref(false);

// Custom Category State
const showNewCategoryForm = ref(false);
const newCategoryName = ref('');
const newCategoryIcon = ref('');
const isCreatingCategory = ref(false);

// ==========================================
// State untuk dialog konfirmasi ganti kategori
// ==========================================
const confirmDialog = ref({
  show: false,
  index: null,   // Index kantong yang sedang diubah
  oldId: '',     // categoryId sebelum diganti
  newId: '',     // categoryId yang baru dipilih user
});

// State awal untuk mendeteksi perubahan
const initialPocketsState = ref('[]');

// Deteksi apakah ada perubahan
const hasChanges = computed(() => {
  return JSON.stringify(pocketsData.value) !== initialPocketsState.value;
});

onMounted(async () => {
  isLoadingCategories.value = true;

  // 1. Tunggu kategori selesai dimuat TERLEBIH DAHULU
  //    (agar getCategoryName() bisa resolve dengan benar saat pocketsData dirender)
  if (!budgetStore.categoriesList || budgetStore.categoriesList.length === 0) {
    await budgetStore.fetchAllCategories();
  }

  // 2. Baru load daftar pocket yang sudah tersimpan
  await budgetStore.fetchPockets();

  if (budgetStore.pocketsList.length > 0) {
    pocketsData.value = budgetStore.pocketsList.map(p => ({
      categoryId: p.categoryId,
      limitType: p.percentage != null ? 'percentage' : 'nominal',
      percentage: p.percentage || null,
      limitAmount: p.limitAmount || null,
      keywordsInput: (p.keywords?.length ? p.keywords : p.category?.keywords || []).join(', ')
    }));
  } else {
    addPocket();
  }

  // Simpan state awal setelah dimuat untuk referensi deteksi perubahan
  initialPocketsState.value = JSON.stringify(pocketsData.value);

  isLoadingCategories.value = false;
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

const getCategoryName = (id) => {
  if (!id) return '';
  const cat = availableCategories.value.find(c => c.id === id);
  return cat ? cat.name : '';
};


const getCategoryIcon = (id) => {
  if (!id) return '💼';
  const cat = availableCategories.value.find(c => c.id === id);
  return cat ? cat.icon : '💼';
};

const findCategoryByName = (keywords) => {
  if (!availableCategories.value) return null;
  for (const keyword of keywords) {
    const found = availableCategories.value.find(c => c.name.toLowerCase().includes(keyword.toLowerCase()));
    if (found) return found.id;
  }
  return null;
};

// ==========================================
// Handler konfirmasi ganti kategori
// ==========================================

/**
 * Dipanggil saat user memilih kategori baru dari dropdown.
 * Jika kantong sudah punya kategori sebelumnya, tampilkan dialog konfirmasi.
 * Jika kantong baru (belum ada kategori), langsung set tanpa konfirmasi.
 */
const onCategoryChange = (index, newCategoryId) => {
  const pocket = pocketsData.value[index];
  const oldId = pocket.categoryId;

  // Jika belum ada kategori sebelumnya, langsung set (tidak perlu konfirmasi)
  if (!oldId) {
    pocketsData.value[index].categoryId = newCategoryId;
    return;
  }

  // Jika sama saja, tidak perlu konfirmasi
  if (oldId === newCategoryId) return;

  // Tampilkan dialog konfirmasi
  confirmDialog.value = {
    show: true,
    index,
    oldId,
    newId: newCategoryId,
  };
};

/** User menekan "Ya, Ganti" pada dialog */
const confirmCategoryChange = () => {
  const { index, newId } = confirmDialog.value;
  pocketsData.value[index].categoryId = newId;
  confirmDialog.value = { show: false, index: null, oldId: '', newId: '' };
};

/** User menekan "Batal" pada dialog */
const cancelCategoryChange = () => {
  confirmDialog.value = { show: false, index: null, oldId: '', newId: '' };
};

// ==========================================
// Blueprint
// ==========================================

const applyBlueprint = (type) => {
  pocketsData.value = [];

  if (type === '503020') {
    const plan = [
      { names: ['makan', 'food'], percent: 25 },
      { names: ['tempat tinggal', 'kos', 'sewa', 'rent'], percent: 15 },
      { names: ['transport'], percent: 10 },
      { names: ['hiburan', 'entertainment'], percent: 20 },
      { names: ['belanja', 'shopping'], percent: 10 },
      { names: ['tabungan', 'investasi', 'saving'], percent: 20 },
    ];
    plan.forEach(item => {
      const catId = findCategoryByName(item.names);
      if (catId) pocketsData.value.push({ categoryId: catId, limitType: 'percentage', percentage: item.percent, limitAmount: null, keywordsInput: '' });
    });
    toast.success("Blueprint 50-30-20 diterapkan!");
  } else if (type === 'hemat') {
    const plan = [
      { names: ['makan', 'food'], percent: 40 },
      { names: ['tempat tinggal', 'kos', 'sewa', 'rent'], percent: 30 },
      { names: ['hiburan', 'entertainment'], percent: 10 },
      { names: ['tabungan', 'investasi', 'saving'], percent: 20 },
    ];
    plan.forEach(item => {
      const catId = findCategoryByName(item.names);
      if (catId) pocketsData.value.push({ categoryId: catId, limitType: 'percentage', percentage: item.percent, limitAmount: null, keywordsInput: '' });
    });
    toast.success("Blueprint Mahasiswa Hemat diterapkan!");
  }

  if (pocketsData.value.length === 0) addPocket();
};

// ==========================================
// Custom Category
// ==========================================

const submitNewCategory = async () => {
  if (!newCategoryName.value || !newCategoryIcon.value) return;

  isCreatingCategory.value = true;
  const result = await budgetStore.createCategory(newCategoryName.value, newCategoryIcon.value);
  isCreatingCategory.value = false;

  if (result.success) {
    toast.success("Kategori berhasil ditambahkan!");
    showNewCategoryForm.value = false;
    newCategoryName.value = '';
    newCategoryIcon.value = '';
    pocketsData.value.push({
      categoryId: result.data.id,
      limitType: 'percentage',
      percentage: null,
      limitAmount: null,
      keywordsInput: ''
    });
  } else {
    toast.error(result.message || "Gagal membuat kategori.");
  }
};

// ==========================================
// Total & Submit
// ==========================================

const totalPercentage = computed(() => {
  const salary = budgetStore.salary || 1; // Cegah pembagian dengan 0
  let total = 0;
  pocketsData.value.forEach((pocket) => {
    if (pocket.limitType === 'percentage' && pocket.percentage) {
      total += Number(pocket.percentage);
    } else if (pocket.limitType === 'nominal' && pocket.limitAmount) {
      total += (Number(pocket.limitAmount) / salary) * 100;
    }
  });
  // Bulatkan ke maksimal 2 angka desimal untuk menghindari angka aneh (ex: 70.33333%)
  return Math.round(total * 100) / 100;
});

const handleSubmit = async () => {
  if (totalPercentage.value > 100) {
    toast.error("Total persentase tidak boleh melebihi 100%.");
    return;
  }

  const payload = pocketsData.value.filter(p => p.categoryId).map(p => ({
    categoryId: p.categoryId,
    percentage: p.limitType === 'percentage' ? p.percentage : null,
    limitAmount: p.limitType === 'nominal' ? p.limitAmount : null,
    _keywords: p.keywordsInput
  }));

  if (payload.length === 0) {
    toast.error("Minimal harus ada satu kantong yang diisi.");
    return;
  }

  isSubmitting.value = true;

  const success = await budgetStore.bulkSetupPockets({ pockets: payload });

  if (success) {
    // Update keywords secara fire-and-forget
    for (const item of payload) {
      if (item._keywords && item._keywords.trim() !== '') {
        const keywordArray = item._keywords.split(',').map(k => k.trim()).filter(k => k);
        budgetStore.updateKeywords(item.categoryId, keywordArray);
      }
    }
    toast.success("Kantong berhasil disimpan!");
    isSubmitting.value = false;
    emit('close', { refresh: true });
  } else {
    isSubmitting.value = false;
    toast.error("Gagal menyimpan kantong. Silakan coba lagi.");
  }
};
</script>
