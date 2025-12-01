<script setup>
import { reactive, computed, onMounted, inject, watch } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { useModalStore } from '../../../../stores/modalStore';

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

// 🔥 PERUBAHAN 1: Inisialisasi formData dengan nilai KOSONG/NULL 🔥
const formData = reactive({
  amount: null,
  categoryId: "",
  date: "", // Biarkan kosong dulu
  note: "",
});

// Fungsi untuk mengisi form dari data awal (atau reset ke default)
const populateForm = () => {
  if (isEditMode.value) {
    console.log("✏️ Mengisi form untuk EDIT:", props.initialData);
    formData.amount = props.initialData.amount;
    formData.categoryId = props.initialData.categoryId;

    // Format tanggal untuk input type="date"
    let dateValue = props.initialData.date;
    if (dateValue instanceof Date) {
      dateValue = dateValue.toISOString().split('T')[0];
    } else if (typeof dateValue === 'string' && dateValue.includes('T')) {
      dateValue = dateValue.split('T')[0];
    }
    formData.date = dateValue;

    formData.note = props.initialData.note || "";
  } else {
    // Mode Create: Reset ke default
    console.log("✨ Reset form untuk CREATE (Set nilai default)");
    formData.amount = null;
    formData.categoryId = "";
    // 🔥 PERUBAHAN 2: Tanggal hari ini hanya di-set DI SINI 🔥
    formData.date = new Date().toISOString().split('T')[0];
    formData.note = "";
  }
};

// Watcher: Isi form setiap kali props berubah.
// Hapus { immediate: true } untuk menghindari race condition saat inisialisasi.
watch(() => [props.initialData, props.transactionId], populateForm);

onMounted(() => {
  budgetStore.fetchAllCategories();
  // Panggil populateForm sekali saat mounted agar data terisi pertama kali
  populateForm();
});

// Computed untuk validasi sederhana
const isFormValid = computed(() => {
  return formData.amount > 0 && formData.categoryId !== "" && formData.date;
});

// Helper formatter (opsional)
const formattedAmountPreview = computed(() => {
  if (!formData.amount) return "Rp 0";
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(formData.amount);
});


// Handler saat tombol "Simpan" ditekan
const handleSubmit = async () => {
  if (!isFormValid.value || budgetStore.isTransactionSubmitting) return;

  let result;
  if (isEditMode.value) {
    // --- MODE EDIT ---
    console.log("🔄 Melakukan UPDATE transaksi ID:", props.transactionId);
    result = await budgetStore.updateTransaction(props.transactionId, { ...formData });
  } else {
    // --- MODE CREATE ---
    console.log("➕ Melakukan CREATE transaksi baru");
    result = await budgetStore.submitTransaction({ ...formData });
  }

  if (result.success) {
    if (closeModalFunc) {
      closeModalFunc();
    }

    modalStore.openModal({
      newTitle: isEditMode.value ? 'Berhasil Diupdate!' : 'Transaksi Berhasil!',
      newMessage: isEditMode.value ? 'Data pengeluaran telah berhasil diperbarui.' : 'Data pengeluaran Anda telah berhasil disimpan.',
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
    <div>
      <label for="amount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Jumlah Pengeluaran
      </label>
      <div class="relative rounded-md shadow-sm">
        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span class="text-gray-500 sm:text-sm">Rp</span>
        </div>
        <input type="number" id="amount" v-model.number="formData.amount" min="1"
          class="block w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 pr-4 py-2 focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-700 dark:text-white sm:text-sm placeholder-gray-400"
          placeholder="0" required />
      </div>
      <p v-if="formData.amount > 0" class="mt-1 text-xs text-violet-600 dark:text-violet-400 font-medium">
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
        <option v-for="cat in budgetStore.expenseCategories" :key="cat.id" :value="cat.id">
          {{ cat.displayName }} </option>
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
        placeholder="Contoh: Makan siang nasi padang..."></textarea>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-100 dark:border-gray-700">
      <button type="button" @click="closeModalFunc"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        :disabled="budgetStore.isTransactionSubmitting">
        Batal
      </button>
      <button type="submit"
        class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-violet-600 border border-transparent rounded-md hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
          {{ isEditMode ? 'Update Pengeluaran' : 'Simpan Pengeluaran' }}
        </span>
      </button>
    </div>

  </form>
</template>