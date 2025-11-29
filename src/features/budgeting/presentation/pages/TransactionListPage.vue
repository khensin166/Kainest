<script setup>
import { onMounted, ref, watch } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
// Import komponen reusable yang baru direfactor (sesuaikan path)
import Datepicker from '@/components/forms/Datepicker.vue';
import DropdownSelect from '@/components/forms/DropdownSelect.vue';
// Import komponen item transaksi
import TransactionItem from '../components/TransactionItem.vue';

const budgetStore = useBudgetStore();

// State untuk filter (menggunakan v-model komponen)
const dateRange = ref(null); // Akan berisi [startDate, endDate] dari Datepicker
const limitPerPage = ref(1); // Default limit

// Opsi untuk dropdown limit
const limitOptions = [
  { label: '1 Halaman', value: 1 },
  { label: '10 Halaman', value: 10 },
  { label: '25 Halaman', value: 25 },
  { label: '50 Halaman', value: 50 },
];

// Fungsi Load Data
const loadTransactions = (page = 1) => {
  let startDate, endDate;
  if (dateRange.value && dateRange.value.length === 2) {
    startDate = dateRange.value[0];
    endDate = dateRange.value[1];
  }

  budgetStore.fetchTransactions({
    page: page,
    limit: limitPerPage.value,
    startDate: startDate,
    endDate: endDate
  });
};

// Watcher: Reload data otomatis saat filter berubah
watch([dateRange, limitPerPage], () => {
  loadTransactions(1); // Reset ke halaman 1 saat filter berubah
});

// Pagination handlers (tetap sama)
const nextPage = () => { if (budgetStore.hasNextPage) loadTransactions(budgetStore.currentPage + 1); };
const prevPage = () => { if (budgetStore.hasPreviousPage) loadTransactions(budgetStore.currentPage - 1); };

// Action handlers (placeholder)
const handleEditClick = (id) => alert("Fitur Edit segera hadir!");
const handleDeleteClick = async (id) => {
  if (confirm("Yakin hapus?")) await budgetStore.deleteTransaction(id);
};

onMounted(() => {
  loadTransactions(1);
});
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Riwayat Transaksi
        </h1>
      </div>

      <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        <Datepicker v-model="dateRange" placeholder="Filter Tanggal..." />

        <DropdownSelect label="Tampilkan" :options="limitOptions" v-model="limitPerPage" />
      </div>
    </div>

    <div
      class="col-span-full bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-100 dark:border-gray-700/60 relative">
      <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 class="font-semibold text-gray-800 dark:text-gray-100">Aktivitas Terakhir</h2>
      </header>

      <div class="p-3">

        <div v-if="budgetStore.isLoadingTransactions" class="flex justify-center items-center h-32">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </div>

        <div v-else-if="budgetStore.transactionsList.length === 0"
          class="flex flex-col items-center justify-center h-32 text-gray-500">
          <p>Tidak ada transaksi yang ditemukan.</p>
        </div>

        <div v-else>
          <div v-for="(transactions, groupName) in budgetStore.groupedTransactions" :key="groupName" class="mb-4">

            <header
              class="text-xs uppercase text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-xs font-semibold p-2 mb-1 sticky top-0 z-10">
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
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            Sebelumnya
          </button>
          <button @click="nextPage" :disabled="!budgetStore.hasNextPage || budgetStore.isLoadingTransactions"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  </div>
</template>