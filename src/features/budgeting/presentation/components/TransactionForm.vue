<!-- Transaction Form -->
<script setup>
import { reactive, computed, onMounted, inject, watch } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useModalStore } from '../../../../stores/modalStore';
import { formatRupiah } from '@/utils/Utils';

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
    formData.type = props.initialData.type || "EXPENSE";
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
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Jenis Transaksi
      </label>
      <div class="flex p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <button type="button" 
          @click="formData.type = 'EXPENSE'"
          :class="formData.type === 'EXPENSE' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          class="flex-1 py-1.5 px-3 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2">
          <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
          Pengeluaran
        </button>
        <button type="button" 
          @click="formData.type = 'INCOME'"
          :class="formData.type === 'INCOME' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'"
          class="flex-1 py-1.5 px-3 rounded-md text-sm font-semibold transition-all flex items-center justify-center gap-2">
          <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          Pemasukan
        </button>
      </div>
    </div>

    <div>
      <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Jumlah {{ formData.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran' }}
      </label>
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span class="text-gray-500 sm:text-sm">Rp</span>
        </div>
        <input type="number" id="amount" v-model.number="formData.amount" min="1"
          class="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-white sm:text-sm placeholder-gray-400"
          placeholder="0" required />
      </div>
      <p v-if="formData.amount > 0" class="mt-1 text-xs font-medium" :class="formData.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-violet-600 dark:text-violet-400'">
        {{ formattedAmountPreview }}
      </p>
    </div>

    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Kategori
      </label>
      <select id="category" v-model="formData.categoryId"
        class="block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 pl-3 pr-10 text-base focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        required :disabled="budgetStore.isLoadingCategories">
        <option value="" disabled>-- Pilih Kategori --</option>
        <option v-for="cat in activeCategories" :key="cat.id" :value="cat.id">
          {{ cat.displayName || cat.name }} </option>
      </select>
      <p v-if="budgetStore.isLoadingCategories" class="mt-1 text-xs text-gray-500 animate-pulse">
        Sedang memuat kategori...
      </p>
    </div>

    <div>
      <label for="date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Tanggal
      </label>
      <input type="date" id="date" v-model="formData.date"
        class="block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 px-3 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-white sm:text-sm"
        required />
    </div>

    <div>
      <label for="note" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Catatan (Opsional)
      </label>
      <textarea id="note" v-model="formData.note" rows="2"
        class="block w-full rounded-md border-gray-300 dark:border-gray-600 py-2 px-3 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-white sm:text-sm placeholder-gray-400"
        :placeholder="formData.type === 'INCOME' ? 'Contoh: Bonus proyek sampingan, uang saku ekstra...' : 'Contoh: Beli makan siang nasi padang...'"></textarea>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
      <button type="button" @click="closeModalFunc"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        :disabled="budgetStore.isTransactionSubmitting">
        Batal
      </button>
      <button type="submit"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        :class="formData.type === 'INCOME' ? 'bg-green-600 hover:bg-green-700 focus-visible:ring-green-500' : 'bg-violet-600 hover:bg-violet-700 focus-visible:ring-violet-500'"
        :disabled="!isFormValid || budgetStore.isTransactionSubmitting">

        <span v-if="budgetStore.isTransactionSubmitting" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ isEditMode ? 'Mengupdate...' : 'Menyimpan...' }}
        </span>

        <span v-else>
          {{ isEditMode ? 'Update Transaksi' : 'Simpan Transaksi' }}
        </span>
      </button>
    </div>

  </form>
</template>