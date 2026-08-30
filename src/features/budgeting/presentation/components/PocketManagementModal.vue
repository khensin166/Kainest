<template>
  <div class="px-5 py-4 w-full max-h-[85vh] overflow-y-auto" ref="scrollContainer" @scroll="handleScroll">
    <div class="text-sm font-medium text-text-muted mb-6">
      Kelola "Kantong" (Pocket) Pengeluaran Anda. Tentukan batas persentase atau nominal untuk tiap kategori.
    </div>

    <!-- 🌟 Onboarding Banner: Tampil hanya saat kantong masih kosong -->
    <div v-if="isOnboarding" class="mb-5 p-4 rounded-md border border-border-default bg-surface-subtle">
      <div class="flex items-start gap-3">
        <IconWave class="w-6 h-6 mt-0.5 shrink-0 text-brand-primary" aria-hidden="true" />
        <div>
          <p class="text-sm font-semibold text-text-primary">Selamat datang! Ayo buat kantong keuangan pertamamu</p>
          <p class="text-xs text-text-primary mt-1 leading-relaxed">
            Gunakan <strong>⚡ Blueprint Cepat</strong> untuk menerapkan template instan, atau tekan
            <strong>+ Tambah Kantong Baru</strong> untuk membuat secara custom sesuai kebutuhanmu.
          </p>
        </div>
      </div>
    </div>

    <!-- Alert / Summary Info -->
    <div class="mb-6 p-4 rounded-lg bg-surface-subtle border border-border-default">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-text-secondary">Total Persentase Terpakai:</span>
        <span class="text-lg font-bold" :class="totalPercentage > 100 ? 'text-status-danger' : 'text-text-primary font-bold'">
          {{ totalPercentage }}%
        </span>
      </div>
      <p v-if="totalPercentage > 100" class="text-xs text-status-danger mt-1">
        Total persentase tidak boleh melebihi 100%.
      </p>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Blueprint Recommendations — Collapsible -->
      <div class="mb-6 border border-border-default rounded-md overflow-hidden">
        <!-- Toggle Header -->
        <button
          type="button"
          @click="isBlueprintExpanded = !isBlueprintExpanded"
          class="w-full flex items-center justify-between px-4 py-3 bg-surface-card hover:bg-surface-hover transition-colors"
        >
          <span class="text-sm font-medium text-text-primary flex items-center gap-2">
            <IconBolt class="w-4 h-4 text-status-warning" aria-hidden="true" />
            Rekomendasi Blueprint Cepat
            <span class="ml-1 inline-flex h-2 w-2 rounded-full bg-brand-primary animate-ping opacity-75"></span>
          </span>
          <IconChevronDown class="w-4 h-4 text-text-muted transition-transform duration-200" aria-hidden="true" />
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
          <div v-show="isBlueprintExpanded" class="px-4 py-3 border-t border-border-default">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" @click="applyBlueprint('503020')" class="p-3 border border-border-default rounded-md bg-surface-card hover:border-brand-primary hover:ring-1 hover:ring-brand-primary text-left transition-all">
                <h4 class="font-medium text-sm text-text-primary">Aturan 50-30-20</h4>
                <p class="text-xs text-text-muted mt-1">Ideal: 50% Pokok, 30% Hiburan, 20% Tabungan.</p>
              </button>
              <button type="button" @click="applyBlueprint('hemat')" class="p-3 border border-border-default rounded-md bg-surface-card hover:border-brand-primary hover:ring-1 hover:ring-brand-primary text-left transition-all">
                <h4 class="font-medium text-sm text-text-primary">Mahasiswa Kos (Hemat)</h4>
                <p class="text-xs text-text-muted mt-1">Fokus: 70% Pokok, 10% Hiburan, 20% Tabungan.</p>
              </button>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Action Buttons moved to TOP (above pocket list) -->
      <div class="mb-4 flex flex-col sm:flex-row gap-2">
        <button type="button" @click="addPocket" class="flex-1 py-2.5 border-2 border-dashed border-border-default rounded-md text-text-muted hover:border-brand-primary hover:text-text-primary transition-all flex items-center justify-center gap-2 font-medium text-sm">
          <IconAdd class="w-4 h-4" aria-hidden="true" />
          Tambah Kantong Baru
        </button>
        <button v-if="!showNewCategoryForm" type="button" @click="showNewCategoryForm = true; categoryFormError = ''" class="flex-1 py-2.5 border-2 border-dashed border-border-strong rounded-md text-text-primary hover:border-brand-primary hover:bg-surface-hover transition-all flex items-center justify-center gap-2 font-medium text-sm">
          <IconAdd class="w-4 h-4" aria-hidden="true" />
          Buat Kategori Kustom
        </button>
      </div>

      <!-- Custom Category Inline Form (at top, appears when active) -->
      <div v-if="showNewCategoryForm" class="mb-4 p-4 rounded-md border border-border-default bg-surface-subtle">
        <h4 class="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <IconTag class="w-4 h-4" aria-hidden="true" />
          Buat Kategori Kustom
        </h4>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="sm:col-span-2">
            <label class="block text-xs font-medium text-text-muted mb-1">Nama Kategori <span class="text-status-danger">*</span></label>
            <input v-model="newCategoryName" type="text" class="form-input w-full text-sm rounded-lg" placeholder="cth: Uang Kucing" />
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted mb-1">Ikon (Emoji) <span class="text-status-danger">*</span></label>
            <input v-model="newCategoryIcon" type="text" class="form-input w-full text-sm rounded-lg text-center" placeholder="cth: 😺" maxlength="2" />
          </div>
        </div>
        <!-- Validation Error Message -->
        <p v-if="categoryFormError" class="mt-2 text-xs text-status-danger flex items-center gap-1">
          <IconWarning class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          {{ categoryFormError }}
        </p>
        <div class="flex justify-end gap-2 mt-3">
          <button type="button" @click="showNewCategoryForm = false; categoryFormError = ''" class="text-xs px-3 py-1.5 text-text-muted hover:bg-surface-hover rounded-lg transition-colors">Batal</button>
          <button type="button" @click="submitNewCategory" class="text-xs px-3 py-1.5 bg-brand-primary text-text-inverse hover:bg-brand-primary-hover rounded-lg transition-colors" :disabled="isCreatingCategory">
            {{ isCreatingCategory ? 'Menyimpan...' : 'Simpan Kategori' }}
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Loading state saat kategori belum ready -->
        <div v-if="isLoadingCategories" class="flex items-center justify-center py-8 text-text-muted gap-2">
          <Spinner class="w-5 h-5" />
          <span class="text-sm">Memuat data kategori...</span>
        </div>

        <template v-else>
          <div v-for="(pocket, index) in pocketsData" :key="index" class="p-4 rounded-md border border-border-default bg-surface-card">
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-medium text-text-primary flex items-center gap-2">
                <span class="text-xl">{{ getCategoryIcon(pocket.categoryId) }}</span>
                <span>{{ getCategoryName(pocket.categoryId) || 'Pilih Kategori' }}</span>
              </h3>
              <button type="button" @click="removePocket(index)" class="text-status-danger hover:text-status-danger text-sm p-1">
                <IconDelete class="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Pilihan Kategori — pakai @update:modelValue agar bisa intercept untuk konfirmasi -->
              <div class="sm:col-span-2 relative">
                <label class="block text-xs font-medium text-text-muted mb-0.5">Kategori</label>
                <p class="text-xs text-text-muted mb-2">Pilih kategori pengeluaran (misal: Makanan, Transportasi, atau Tabungan).</p>
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
                <label class="block text-xs font-medium text-text-muted mb-0.5">Tipe Batas</label>
                <p class="text-xs text-text-muted mb-2 leading-tight">Gunakan "Persentase" untuk alokasi dari gaji bulanan Anda, atau "Nominal" untuk nilai tetap/pasti.</p>
                <DropdownSelect
                  v-model="pocket.limitType"
                  :options="[{label: 'Persentase (%)', value: 'percentage'}, {label: 'Nominal (Rp)', value: 'nominal'}]"
                  label="Tipe"
                  class="w-full"
                />
              </div>

              <!-- Input Nilai -->
              <div class="flex flex-col h-full">
                <label class="block text-xs font-medium text-text-muted mb-0.5">
                  {{ pocket.limitType === 'percentage' ? 'Persentase (%)' : 'Batas Maksimal (Rp)' }}
                </label>
                <p class="text-xs text-text-muted mb-2 leading-tight">Sesuaikan dengan target atau batas rencana pengeluaran bulanan Anda.</p>
                <div v-if="pocket.limitType === 'percentage'">
                  <input v-model.number="pocket.percentage" type="number" min="1" max="100" class="form-input w-full text-sm rounded-lg" placeholder="Contoh: 15" required />
                  <div class="mt-1 text-xs font-semibold text-status-success">
                    ~ {{ formatRupiah((pocket.percentage / 100) * budgetStore.salary) }}
                  </div>
                </div>
                <!-- CurrencyInput: format Rupiah realtime, mengirim angka murni ke v-model -->
                <CurrencyInput
                  v-else
                  v-model="pocket.limitAmount"
                  :min="1000"
                  placeholder="Contoh: 500.000"
                  required
                />
              </div>

              <!-- Kata Kunci Kustom (Optional) -->
              <div class="sm:col-span-2 mt-2">
                <label class="block text-xs font-medium text-text-muted mb-0.5">Kata Kunci AI (Pisahkan dengan koma)</label>
                <p class="text-xs text-text-muted mb-2 leading-tight">Bot WhatsApp akan otomatis mendeteksi dan memasukkan pengeluaran ke kantong ini jika Anda mengetik kata kunci tersebut saat mencatat via chat.</p>
                <input v-model="pocket.keywordsInput" type="text" class="form-input w-full text-sm rounded-lg" placeholder="Cth: kfc, gofood, bensin, pulsa" />
              </div>
            </div>
          </div>

          <!-- (buttons moved to top, pocket list ends here) -->
        </template>
      </div>

    </form>

    <!-- ====================================================== -->
    <!-- FLOATING ACTION BUTTON (FAB) - Visible when NOT at bottom -->
    <!-- ====================================================== -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-8 scale-90"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-8 scale-90"
    >
      <div v-show="!isScrolledToBottom" class="fixed right-5 bottom-8 z-[60] flex items-center gap-2 pb-[env(safe-area-inset-bottom)] sm:hidden">
        <!-- Batal FAB -->
        <button type="button"
          @click="$emit('close')"
          :disabled="isSubmitting"
          class="flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-text-secondary bg-surface-card border border-border-default hover:bg-surface-hover transition-colors disabled:opacity-50">
          <IconClose class="w-6 h-6" aria-hidden="true" />
        </button>

        <!-- Simpan FAB -->
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting || totalPercentage > 100 || !hasChanges"
          class="flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-text-inverse font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :class="isSubmitting || totalPercentage > 100 || !hasChanges ? 'bg-surface-subtle text-text-faint' : 'bg-brand-primary hover:bg-brand-primary-hover'">
          <IconCheck class="w-6 h-6" aria-hidden="true" />
        </button>
      </div>
    </Transition>

    <!-- ====================================================== -->
    <!-- STATIC FOOTER - Visible completely when scrolled to bottom -->
    <!-- ====================================================== -->
    <div class="mt-6 flex flex-col sm:flex-row justify-end items-center gap-3 pt-5 border-t border-border-default">
      
      <!-- Info text (Ada perubahan atau melebihi 100%) -->
      <div class="w-full sm:w-auto flex-1 text-center sm:text-left mb-2 sm:mb-0">
        <span v-if="totalPercentage > 100" class="text-xs text-status-danger font-medium">⚠ Total persentase melebihi 100%</span>
        <span v-else-if="!hasChanges" class="text-xs text-text-muted font-medium">Belum ada perubahan yang perlu disimpan</span>
        <span v-else class="text-xs text-text-primary font-bold font-medium">✓ Ada perubahan — siap disimpan</span>
      </div>

      <div class="flex w-full sm:w-auto gap-3">
        <!-- Batal -->
        <button type="button"
          @click="$emit('close')"
          :disabled="isSubmitting"
          class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-text-secondary bg-surface-card border border-border-default hover:bg-surface-hover transition-colors disabled:opacity-50 font-medium text-sm">
          Batal
        </button>

        <!-- Simpan -->
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting || totalPercentage > 100 || !hasChanges"
          class="flex-[2] sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-md text-text-inverse font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          :class="isSubmitting || totalPercentage > 100 || !hasChanges ? 'bg-surface-subtle text-text-faint' : 'bg-brand-primary hover:bg-brand-primary-hover'">
          {{ isSubmitting ? 'Menyimpan...' : 'Simpan Kantong' }}
        </button>
      </div>
    </div>

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
        <p class="text-sm text-text-muted mb-4">Anda akan mengganti kategori kantong ini:</p>

        <!-- Perbandingan Sebelum → Sesudah -->
        <div class="flex items-center gap-3 p-3 rounded-md bg-surface-subtle mb-5">
          <div class="text-center flex-1">
            <p class="text-xs text-text-muted mb-1">Sebelum</p>
            <p class="text-sm font-semibold text-text-primary">
              {{ getCategoryIcon(confirmDialog.oldId) }} {{ getCategoryName(confirmDialog.oldId) || '—' }}
            </p>
          </div>
          <IconArrowRight class="w-5 h-5 text-text-muted shrink-0" aria-hidden="true" />
          <div class="text-center flex-1">
            <p class="text-xs text-text-muted mb-1">Sesudah</p>
            <p class="text-sm font-semibold text-text-primary">
              {{ getCategoryIcon(confirmDialog.newId) }} {{ getCategoryName(confirmDialog.newId) }}
            </p>
          </div>
        </div>

        <p class="text-xs text-text-muted dark:text-text-muted">
          Perubahan ini baru tersimpan ke database setelah Anda menekan tombol <strong>"Simpan Kantong"</strong>.
        </p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { Spinner } from '@/ui';
import { IconAdd, IconArrowRight, IconBolt, IconCheck, IconChevronDown, IconClose, IconDelete, IconTag, IconWarning, IconWave } from '@/ui/icons';
import { ref, computed, onMounted, defineEmits, nextTick } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { notify } from "@/lib/notify";
import DropdownSelect from '@/components/forms/DropdownSelect.vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import CurrencyInput from '@/components/forms/CurrencyInput.vue';
import { formatRupiah } from '@/utils/Utils';

const emit = defineEmits(['close']);
const budgetStore = useBudgetStore();

// Default kosong
const pocketsData = ref([]);

// Loading state untuk keseluruhan modal
const isLoadingCategories = ref(true);

// Blueprint section collapsible — auto-expand saat pertama buka jika onboarding
const isBlueprintExpanded = ref(false);

// Submitting state (terpisah dari isLoadingPockets agar tidak memicu re-render parent)
const isSubmitting = ref(false);

// Custom Category State
const showNewCategoryForm = ref(false);
const newCategoryName = ref('');
const newCategoryIcon = ref('');
const isCreatingCategory = ref(false);
const categoryFormError = ref('');

// ==========================================
// Scroll Detection untuk Floating Action Button
// ==========================================
const scrollContainer = ref(null);
const isScrolledToBottom = ref(false);

const handleScroll = () => {
  if (!scrollContainer.value) return;
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value;
  // Threshold of 20px to consider it at the bottom
  isScrolledToBottom.value = Math.ceil(scrollTop + clientHeight) >= scrollHeight - 20;
};

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
    // Auto-expand blueprint saat onboarding (belum ada kantong)
    isBlueprintExpanded.value = true;
  }

  // Simpan state awal setelah dimuat untuk referensi deteksi perubahan
  initialPocketsState.value = JSON.stringify(pocketsData.value);

  isLoadingCategories.value = false;

  // Cek scroll setelah DOM diupdate dengan list awal
  nextTick(() => {
    handleScroll();
  });
});

const availableCategories = computed(() => budgetStore.categoriesList || []);

// Computed: true jika user belum punya kantong sama sekali (mode onboarding)
const isOnboarding = computed(() => budgetStore.pocketsList.length === 0);

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
  // Sekaligus auto-fill keywords dari kategori yang dipilih
  if (!oldId) {
    pocketsData.value[index].categoryId = newCategoryId;
    // Auto-fill keywordsInput dari kategori master
    const cat = availableCategories.value.find(c => c.id === newCategoryId);
    if (cat?.keywords?.length && !pocketsData.value[index].keywordsInput) {
      pocketsData.value[index].keywordsInput = cat.keywords.join(', ');
    }
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

  const buildPocket = (catId, percent) => {
    // Ambil keywords dari master kategori untuk auto-fill
    const cat = availableCategories.value.find(c => c.id === catId);
    const kw = cat?.keywords?.length ? cat.keywords.join(', ') : '';
    return { categoryId: catId, limitType: 'percentage', percentage: percent, limitAmount: null, keywordsInput: kw };
  };

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
      if (catId) pocketsData.value.push(buildPocket(catId, item.percent));
    });
    notify.success('Blueprint 50-30-20 diterapkan!');
  } else if (type === 'hemat') {
    const plan = [
      { names: ['makan', 'food'], percent: 40 },
      { names: ['tempat tinggal', 'kos', 'sewa', 'rent'], percent: 30 },
      { names: ['hiburan', 'entertainment'], percent: 10 },
      { names: ['tabungan', 'investasi', 'saving'], percent: 20 },
    ];
    plan.forEach(item => {
      const catId = findCategoryByName(item.names);
      if (catId) pocketsData.value.push(buildPocket(catId, item.percent));
    });
    notify.success('Blueprint Mahasiswa Hemat diterapkan!');
  }

  if (pocketsData.value.length === 0) addPocket();
};

// ==========================================
// Custom Category
// ==========================================

const submitNewCategory = async () => {
  // Validasi dengan error message
  if (!newCategoryName.value && !newCategoryIcon.value) {
    categoryFormError.value = 'Nama kategori dan ikon wajib diisi terlebih dahulu.';
    return;
  }
  if (!newCategoryName.value) {
    categoryFormError.value = 'Nama kategori wajib diisi.';
    return;
  }
  if (!newCategoryIcon.value) {
    categoryFormError.value = 'Ikon (emoji) wajib diisi. Contoh: 😺';
    return;
  }
  categoryFormError.value = '';

  isCreatingCategory.value = true;
  const result = await budgetStore.createCategory(newCategoryName.value, newCategoryIcon.value);
  isCreatingCategory.value = false;

  if (result.success) {
    notify.success("Kategori berhasil ditambahkan!");
    showNewCategoryForm.value = false;
    newCategoryName.value = '';
    newCategoryIcon.value = '';
    categoryFormError.value = '';
    pocketsData.value.push({
      categoryId: result.data.id,
      limitType: 'percentage',
      percentage: null,
      limitAmount: null,
      keywordsInput: ''
    });
  } else {
    notify.error(result.message || "Gagal membuat kategori.");
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
    notify.error("Total persentase tidak boleh melebihi 100%.");
    return;
  }

  const payload = pocketsData.value.filter(p => p.categoryId).map(p => ({
    categoryId: p.categoryId,
    percentage: p.limitType === 'percentage' ? p.percentage : null,
    limitAmount: p.limitType === 'nominal' ? p.limitAmount : null,
    _keywords: p.keywordsInput
  }));

  if (payload.length === 0) {
    notify.error("Minimal harus ada satu kantong yang diisi.");
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
    notify.success("Kantong berhasil disimpan!");
    isSubmitting.value = false;
    emit('close', { refresh: true });
  } else {
    isSubmitting.value = false;
    notify.error("Gagal menyimpan kantong. Silakan coba lagi.");
  }
};
</script>
