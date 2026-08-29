<!-- Transaction Form -->
<script setup>
import { Spinner } from '@/ui';
import { IconArrowDown, IconArrowUp } from '@/ui/icons';
import { reactive, computed, onMounted, inject, watch } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useModalStore } from '../../../../stores/modalStore';
import { formatRupiah } from '@/utils/Utils';
import CurrencyInput from '@/components/forms/CurrencyInput.vue';

const budgetStore = useBudgetStore();
const modalStore = useModalStore();

const props = defineProps({
  // Data transaksi untuk mode EDIT. Jika null, berarti mode CREATE.
  initialData: {
    type: Object,
    default: null,
  },
  // ID transaksi untuk mode EDIT
  transactionId: {
    type: [String, Number],
    default: null,
  }
});

// Inject fungsi 'closeModalFunc' yang disediakan oleh parent
const closeModalFunc = inject('closeModalFunc');

// Computed untuk menentukan mode
const isEditMode = computed(() => !!props.transactionId && !!props.initialData);

// State form
const formData = reactive({
  type: "EXPENSE", // Default ke Pengeluaran
  amount: null,
  categoryId: "",
  date: "", 
  note: "",
});

// Computed categories based on selected type
const activeCategories = computed(() => {
  return formData.type === 'INCOME' 
    ? budgetStore.incomeCategories 
    : budgetStore.expenseCategories;
});

// Reset selected category when changing type
watch(() => formData.type, (newType, oldType) => {
  if (oldType !== newType && !isEditMode.value) {
    formData.categoryId = "";
  }
});

// Fungsi untuk mengisi form dari data awal
const populateForm = () => {
  if (isEditMode.value) {
    formData.type = props.initialData.type || props.initialData.category?.type || "EXPENSE";
    formData.amount = props.initialData.amount;

    const targetCategoryId = props.initialData.categoryId || props.initialData.category?.id;
    formData.categoryId = targetCategoryId ? String(targetCategoryId) : "";

    let dateValue = props.initialData.date;
    if (dateValue) {
      if (dateValue instanceof Date) {
        dateValue = dateValue.toISOString().substring(0, 10);
      } else if (typeof dateValue === 'string') {
        dateValue = dateValue.substring(0, 10);
      }
    }
    formData.date = dateValue;
    formData.note = props.initialData.note || "";
  } else {
    formData.type = "EXPENSE";
    formData.amount = null;
    formData.categoryId = "";
    formData.date = new Date().toISOString().split('T')[0];
    formData.note = "";
  }
};

// Race Condition Fix untuk categories list
watch(
  () => budgetStore.expenseCategories,
  (newCategories) => {
    if (newCategories && newCategories.length > 0 && isEditMode.value && props.initialData) {
      const targetCategoryId = props.initialData.categoryId || props.initialData.category?.id;
      if (targetCategoryId) {
        formData.categoryId = String(targetCategoryId);
      }
    }
  },
  { deep: true }
);

onMounted(() => {
  budgetStore.fetchAllCategories();
  populateForm();
});

// FIX LIFECYCLE: Saat modal dibuka ulang untuk edit transaksi berbeda,
// onMounted TIDAK dipanggil lagi. Watch ini memastikan form selalu
// mengisi ulang dirinya ketika initialData berubah (transaksi baru diklik).
watch(() => props.initialData, (newData) => {
  if (newData) {
    populateForm();
  }
}, { deep: true });

// Computed untuk validasi sederhana
const isFormValid = computed(() => {
  return formData.amount > 0 && formData.categoryId !== "" && formData.date;
});

// Helper formatter
const formattedAmountPreview = computed(() => {
  return formatRupiah(formData.amount);
});

// Submit
const handleSubmit = async () => {
  if (!isFormValid.value || budgetStore.isTransactionSubmitting) return;

  let result;
  if (isEditMode.value) {
    result = await budgetStore.updateTransaction(props.transactionId, { ...formData });
  } else {
    result = await budgetStore.submitTransaction({ ...formData });
  }

  if (result.success) {
    if (closeModalFunc) {
      closeModalFunc();
    }
    modalStore.openModal({
      newTitle: isEditMode.value ? 'Berhasil Diupdate!' : 'Transaksi Berhasil!',
      newMessage: isEditMode.value ? 'Data transaksi telah berhasil diperbarui.' : 'Data transaksi Anda telah berhasil disimpan.',
      newStatus: 'success',
    });
  } else {
    modalStore.openModal({
      newTitle: isEditMode.value ? 'Gagal Update' : 'Gagal Menyimpan',
      newMessage: result.message || 'Terjadi kesalahan saat memproses data.',
      newStatus: 'error',
    });
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    
    <!-- Tipe Transaksi Toggle -->
    <div>
      <label class="block text-sm font-medium text-text-secondary mb-1">
        Jenis Transaksi
      </label>
      <div class="flex p-1 bg-surface-subtle rounded-lg border border-border-default">
        <button type="button"
          @click="formData.type = 'EXPENSE'"
          :class="formData.type === 'EXPENSE' ? 'bg-surface-card text-text-primary border border-border-default' : 'text-text-muted hover:text-text-secondary'"
          class="flex-1 py-1.5 px-3 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2">
          <IconArrowUp class="w-4 h-4 text-status-danger" aria-hidden="true" />
          Pengeluaran
        </button>
        <button type="button"
          @click="formData.type = 'INCOME'"
          :class="formData.type === 'INCOME' ? 'bg-surface-card text-text-primary border border-border-default' : 'text-text-muted hover:text-text-secondary'"
          class="flex-1 py-1.5 px-3 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2">
          <IconArrowDown class="w-4 h-4 text-status-success" aria-hidden="true" />
          Pemasukan
        </button>
      </div>
    </div>

    <div>
      <label for="amount" class="block text-sm font-medium text-text-secondary mb-1">
        Jumlah {{ formData.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran' }}
      </label>
      <CurrencyInput
        id="amount"
        v-model="formData.amount"
        :min="1"
        :required="true"
        :placeholder="formData.type === 'INCOME' ? 'Contoh: 1.000.000' : 'Contoh: 50.000'"
      />
      <p v-if="formData.amount > 0" class="mt-1 text-xs font-medium"
         :class="formData.type === 'INCOME' ? 'text-status-success' : 'text-brand-primary'">
        {{ formattedAmountPreview }}
      </p>
    </div>

    <div>
      <label for="category" class="block text-sm font-medium text-text-secondary mb-1">
        Kategori
      </label>
      <select id="category" v-model="formData.categoryId"
        class="block w-full rounded-md border-border-default py-2 pl-3 pr-10 text-base bg-surface-input text-text-primary focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
        required :disabled="budgetStore.isLoadingCategories">
        <option value="" disabled>-- Pilih Kategori --</option>
        <option v-for="cat in activeCategories" :key="cat.id" :value="cat.id">
          {{ cat.displayName || cat.name }} </option>
      </select>
      <p v-if="budgetStore.isLoadingCategories" class="mt-1 text-xs text-text-muted animate-pulse">
        Sedang memuat kategori...
      </p>
    </div>

    <div>
      <label for="date" class="block text-sm font-medium text-text-secondary mb-1">
        Tanggal
      </label>
      <input type="date" id="date" v-model="formData.date"
        class="block w-full rounded-md border-border-default py-2 px-3 focus:border-brand-primary focus:ring-brand-primary bg-surface-input text-text-primary sm:text-sm"
        required />
    </div>

    <div>
      <label for="note" class="block text-sm font-medium text-text-secondary mb-1">
        Catatan (Opsional)
      </label>
      <textarea id="note" v-model="formData.note" rows="2"
        class="block w-full rounded-md border-border-default py-2 px-3 focus:border-brand-primary focus:ring-brand-primary bg-surface-input text-text-primary sm:text-sm placeholder:text-text-faint"
        :placeholder="formData.type === 'INCOME' ? 'Contoh: Bonus proyek sampingan, uang saku ekstra...' : 'Contoh: Beli makan siang nasi padang...'"></textarea>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-border-muted">
      <button type="button" @click="closeModalFunc"
        class="px-4 py-2 text-sm font-medium text-text-secondary bg-surface-card border border-border-default rounded-md hover:bg-surface-hover focus:outline-none"
        :disabled="budgetStore.isTransactionSubmitting">
        Batal
      </button>
      <button type="submit"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-text-inverse border border-transparent rounded-md focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :class="formData.type === 'INCOME' ? 'bg-status-success hover:bg-status-success/90' : 'bg-brand-primary hover:bg-brand-primary-hover'"
        :disabled="!isFormValid || budgetStore.isTransactionSubmitting">

        <span v-if="budgetStore.isTransactionSubmitting" class="flex items-center">
          <Spinner class="-ml-1 mr-2 h-4 w-4 text-current" />
          {{ isEditMode ? 'Mengupdate...' : 'Menyimpan...' }}
        </span>

        <span v-else>
          {{ isEditMode ? 'Update Transaksi' : 'Simpan Transaksi' }}
        </span>
      </button>
    </div>

  </form>
</template>