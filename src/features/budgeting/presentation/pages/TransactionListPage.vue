<!-- TransactionListPage.vue -->

<script>
export default {
  name: 'TransactionListPage'
}
</script>
<script setup>
import { onMounted, ref, watch, computed, provide, onActivated } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import Datepicker from '@/components/forms/Datepicker.vue';
import DropdownSelect from '@/components/forms/DropdownSelect.vue';
import BaseEmptyState from '@/components/BaseEmptyState.vue';
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';
import TransactionItem from '../components/TransactionItem.vue';
import { debounce } from '../../../../utils/debounce';
import { useModalStore } from '../../../../stores/modalStore';
import { DialogTitle } from '@headlessui/vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import TransactionForm from '../components/TransactionForm.vue';

const budgetStore = useBudgetStore();
const modalStore = useModalStore();

// State untuk filter (menggunakan v-model komponen)
const dateRange = ref(null);
const limitPerPage = ref(10);
const searchQuery = ref('');
const isFilterExpanded = ref(false);

// Opsi untuk dropdown limit
const limitOptions = [
  { label: '10 Halaman', value: 10 },
  { label: '25 Halaman', value: 25 },
  { label: '50 Halaman', value: 50 },
];

// ===========================
// STATE UNTUK FITUR EDIT ✨
// ===========================
const isEditModalOpen = ref(false);
// Menyimpan objek transaksi lengkap yang akan diedit
const selectedTransactionToEdit = ref(null);
// Computed untuk mendapatkan ID-nya saja (untuk prop form)
const selectedTransactionId = computed(() => selectedTransactionToEdit.value?.id || null);

// Fungsi Load Data
const loadTransactions = (page = 1, force = false) => {
  let startDate, endDate;
  if (dateRange.value && dateRange.value.length === 2) {
    startDate = dateRange.value[0];
    endDate = dateRange.value[1];
  }

  budgetStore.fetchTransactions({
    page: page,
    limit: limitPerPage.value,
    startDate: startDate,
    endDate: endDate,
    search: searchQuery.value
  }, force);
};

const debouncedLoadTransactions = debounce(() => {
  loadTransactions(1, true);
}, 500);

// 🔥 2. SOLUSI PAMUNGKAS: Buat Computed Property Stabil 🔥
// Kita ubah array dateRange menjadi string JSON.
// Jika isinya sama (misal ["2025-01-01"], stringnya akan selalu sama.
// Ini mencegah trigger watcher karena perubahan referensi array.
const dateRangeStable = computed(() => {
  return dateRange.value ? JSON.stringify(dateRange.value) : null;
});

const isFilterActive = computed(() => {
  const hasDateFilter = dateRange.value !== null && dateRange.value.length > 0;
  const hasLimitFilter = limitPerPage.value !== 10;
  const hasSearchFilter = searchQuery.value.trim() !== '';

  // Return true jika salah satu kondisi terpenuhi
  return hasDateFilter || hasLimitFilter || hasSearchFilter;
});


// 🔥 3. UBAH WATCHER 🔥
// Jangan watch 'dateRange' langsung, tapi watch 'dateRangeStable'
watch([dateRangeStable, limitPerPage, searchQuery], ([newDateStr, newLimit], [oldDateStr, oldLimit]) => {
  // Logika debugging bisa kita sederhanakan sekarang karena pemicunya sudah stabil
  console.log("🔍 Watcher Filter Stabil Terpanggil");
  console.log("🔍 Filter/Search berubah. Memuat ulang data...");
  console.log(`Date berubah: ${oldDateStr !== newDateStr}`);
  console.log(`Limit berubah: ${oldLimit !== newLimit}`);

  // Panggil fungsi debounced
  debouncedLoadTransactions();
});

const clearFilters = () => {
  dateRange.value = null;
  limitPerPage.value = 10;
  searchQuery.value = '';
};

const nextPage = () => { if (budgetStore.hasNextPage) loadTransactions(budgetStore.currentPage + 1); };
const prevPage = () => { if (budgetStore.hasPreviousPage) loadTransactions(budgetStore.currentPage - 1); };

// ===========================
// HANDLERS AKSI (EDIT & DELETE)
// ===========================

// ✨ Handler saat tombol EDIT diklik di TransactionItem
// Menerima seluruh objek data transaksi
const handleEditClick = (transactionData) => {
  console.log("📝 Membuka modal EDIT untuk:", transactionData.categoryName);
  // Isi state dengan data yang diterima dari child component
  selectedTransactionToEdit.value = transactionData;
  // Buka modal
  isEditModalOpen.value = true;
};

// ✨ Fungsi untuk menutup modal edit dan mereset state
const closeEditModal = () => {
  console.log("🔒 Menutup modal edit.");
  isEditModalOpen.value = false;
  // Tunggu sebentar sebelum reset data agar transisi modal mulus
  setTimeout(() => {
    selectedTransactionToEdit.value = null;
  }, 300);
};

// ✨ Provide fungsi close ini agar bisa dipanggil dari dalam TransactionForm
provide('closeModalFunc', closeEditModal);

// Handler saat tombol tong sampah di item diklik
const handleDeleteClick = (id) => {
  console.log("🗑️ Membuka Global Delete Modal untuk ID:", id);

  // Panggil store untuk membuka modal global
  modalStore.openDeleteModal({
    title: 'Hapus Transaksi?', // Judul kustom (opsional)
    message: 'Apakah Anda yakin ingin menghapus transaksi ini dari riwayat Anda?', // Pesan kustom (opsional)
    // INI BAGIAN PENTING: Fungsi yang akan dijalankan jika user klik "Ya, Hapus"
    onConfirm: async () => {
      console.log("🔥 Eksekusi hapus dari Global Modal untuk ID:", id);
      const result = await budgetStore.deleteTransaction(id);

      if (result.success) {
        // Tampilkan notifikasi sukses global
        modalStore.openModal({
          newTitle: 'Berhasil Dihapus',
          newMessage: 'Transaksi telah berhasil dihapus.',
          newStatus: 'success',
        });
        // Data list otomatis refresh
      } else {
        // Tampilkan notifikasi error global
        modalStore.openModal({
          newTitle: 'Gagal Menghapus',
          newMessage: result.message || 'Terjadi kesalahan.',
          newStatus: 'error',
        });
        throw new Error(result.message);
      }
    }
  });
};

onMounted(() => {
  console.log("🔴 MOUNTED (Halaman dibuat baru - Cache GAGAL)");
  loadTransactions(1, false);
});

onActivated(() => {
  console.log("🟢 ACTIVATED (Halaman dari cache - Cache SUKSES)");
  loadTransactions(budgetStore.currentPage, false);
});
</script>

<template>
  <div>
    <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

      <div class="sm:flex sm:justify-between sm:items-center mb-8">
        <div class="mb-4 sm:mb-0 flex items-center gap-3">
          <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Riwayat Transaksi
          </h1>
          <PageGuide :steps="pageGuides.transactions" />
        </div>

        <div class="flex items-center gap-2">
          <button @click="isFilterExpanded = !isFilterExpanded"
            class="btn border transition-all duration-200 flex items-center px-4 py-2 rounded-md font-medium text-sm relative"
            :class="[
              isFilterActive 
                ? 'bg-violet-50 text-violet-600 border-violet-300 hover:bg-violet-100 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-700/50 dark:hover:bg-violet-900/40'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/60 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400'
            ]">
            <svg class="w-4 h-4 fill-current shrink-0 mr-2" viewBox="0 0 16 16">
              <path d="M15 2h-3v1h3v11H1V3h3V2H1c-.6 0-1 .4-1 1v11c0 .6.4 1 1 1h14c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1zm-6 9h2v-2h-2v2zm-4 0h2v-2H5v2zm0-4h2V5H5v2zm4 0h2V5h-2v2z" />
            </svg>
            Filter & Pencarian
            <!-- Active filter badge dot -->
            <span v-if="isFilterActive" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-violet-600 dark:bg-violet-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse"></span>
          </button>
        </div>
      </div>

      <!-- Expandable Filter Panel -->
      <Transition 
        enter-active-class="transition ease-out duration-200 transform" 
        enter-from-class="opacity-0 -translate-y-2" 
        enter-to-class="opacity-100 translate-y-0" 
        leave-active-class="transition ease-in duration-150 transform" 
        leave-from-class="opacity-100 translate-y-0" 
        leave-to-class="opacity-0 -translate-y-2">
        <div v-show="isFilterExpanded" class="mb-8 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/60 shadow-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            
            <!-- Cari Transaksi -->
            <div class="w-full">
              <label class="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">Cari Transaksi</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a1 1 0 11-1.414 1.414l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <input v-model="searchQuery" type="text" class="block w-full rounded-md border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-violet-600 dark:bg-gray-800 dark:text-gray-100 dark:ring-gray-700 dark:placeholder:text-gray-500 dark:focus:ring-violet-500 sm:text-sm sm:leading-6 transition-colors duration-200 ease-in-out" placeholder="Ketikan kata kunci..." />
              </div>
            </div>
            
            <!-- Rentang Tanggal -->
            <div class="w-full">
              <label class="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">Rentang Tanggal</label>
              <Datepicker v-model="dateRange" placeholder="Filter Tanggal..." />
            </div>

            <!-- Tampilkan -->
            <div class="w-full">
              <label class="block text-sm font-medium mb-1.5 text-gray-600 dark:text-gray-300">Tampilkan</label>
              <DropdownSelect :wFull="true" label="Tampilkan" :options="limitOptions" v-model="limitPerPage" />
            </div>

          </div>

          <!-- Filter Actions Footer -->
          <div v-if="isFilterActive" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/60 flex justify-between items-center">
            <span class="text-xs text-gray-500 dark:text-gray-400">
              Filter aktif sedang diterapkan.
            </span>
            <button @click="clearFilters" class="btn bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100 hover:border-violet-300 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-700/50 dark:hover:bg-violet-900/40 transition-colors duration-200 flex items-center px-4 py-2 rounded-md font-medium text-sm">
              <svg class="w-4 h-4 fill-current shrink-0 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
              </svg>
              Hapus Semua Filter
            </button>
          </div>
        </div>
      </Transition>

      <div
        class="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-100 dark:border-gray-700/60 relative">
        <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
          <h2 class="font-semibold text-gray-800 dark:text-gray-100">Aktivitas Terakhir</h2>
        </header>

        <div class="p-3">

          <div v-if="budgetStore.isLoadingTransactions" class="flex justify-center items-center h-32">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          </div>

          <BaseEmptyState 
            v-else-if="budgetStore.transactionsList.length === 0"
            icon="💸"
            title="Belum ada transaksi"
            message="Tidak ada transaksi yang ditemukan untuk filter ini."
            heightClass="h-32"
          />

          <div v-else>
            <div v-for="(transactions, groupName) in budgetStore.groupedTransactions" :key="groupName" class="mb-4">

              <header
                class="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xl font-semibold p-2 mb-1 sticky top-0 z-10">
                {{ groupName }}
              </header>

              <ul class="my-1 space-y-2">
                <li v-for="transaction in transactions" :key="transaction.id">
                  <TransactionItem :transaction="transaction"
                    :isDeleting="budgetStore.isDeletingTransactionId === transaction.id" @edit="handleEditClick"
                    @delete="handleDeleteClick"
                    class="!shadow-none !border-b !border-gray-100 dark:!border-gray-700/60 hover:!bg-gray-50 dark:hover:!bg-gray-700/20 rounded-none p-2" />
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div v-if="budgetStore.transactionsList.length > 0"
          class="px-5 py-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Halaman <b>{{ budgetStore.currentPage }}</b> dari <b>{{ budgetStore.totalPages }}</b>
          </div>
          <div class="flex space-x-2">
            <button @click="prevPage" :disabled="!budgetStore.hasPreviousPage || budgetStore.isLoadingTransactions"
              class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
              <svg v-if="budgetStore.isLoadingTransactions" class="animate-spin -ml-1 mr-2 h-4 w-4 text-violet-600 dark:text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sebelumnya
            </button>
            <button @click="nextPage" :disabled="!budgetStore.hasNextPage || budgetStore.isLoadingTransactions"
              class="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
              <svg v-if="budgetStore.isLoadingTransactions" class="animate-spin -ml-1 mr-2 h-4 w-4 text-violet-600 dark:text-violet-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>

    <BaseModal :isOpen="isEditModalOpen" @close="closeEditModal" size="md" :hideFooter="true">
      <template #header>
        Edit Transaksi
      </template>
      <template #body>
        <TransactionForm :initialData="selectedTransactionToEdit" :transactionId="selectedTransactionId" />
      </template>
    </BaseModal>
  </div>
</template>