<script setup>
import { onMounted, ref } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import TransactionItem from '../components/TransactionItem.vue';
// Kita akan pakai BaseModal dan TransactionForm lagi nanti untuk fitur Edit
// import BaseModal from '@/components/modals/BaseModal.vue';
// import TransactionForm from '../components/TransactionForm.vue';

const budgetStore = useBudgetStore();

// State untuk filter tanggal (default kosong = semua data bulan ini)
const filterStartDate = ref('');
const filterEndDate = ref('');

// Fungsi untuk memanggil data (bisa dipanggil saat mounted, ganti filter, atau ganti halaman)
const loadTransactions = (page = 1) => {
  budgetStore.fetchTransactions({
    page: page,
    limit: 10, // 10 item per halaman
    startDate: filterStartDate.value || undefined, // Kirim undefined jika string kosong
    endDate: filterEndDate.value || undefined
  });
};

// Handler Pagination
const nextPage = () => {
  if (budgetStore.hasNextPage) {
    loadTransactions(budgetStore.currentPage + 1);
  }
};

const prevPage = () => {
  if (budgetStore.hasPreviousPage) {
    loadTransactions(budgetStore.currentPage - 1);
  }
};

// Handler sementara untuk Edit & Delete (Nanti kita lengkapi)
const handleEditClick = (id) => {
  console.log("Tombol Edit ditekan untuk ID:", id);
  alert("Fitur Edit akan segera hadir!"); // Placeholder
};

const handleDeleteClick = async (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus transaksi ini? Data yang dihapus tidak dapat dikembalikan.")) {
    await budgetStore.deleteTransaction(id);
  }
};

// Load data saat halaman dibuka pertama kali
onMounted(() => {
  // Opsional: Set filter default ke bulan ini agar tidak load semua data sejak awal
  // const now = new Date();
  // filterStartDate.value = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  // filterEndDate.value = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
  
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
      <div>
          </div>
    </div>

    <div v-if="budgetStore.isLoadingTransactions && budgetStore.transactionsList.length === 0" class="flex justify-center items-center h-64">
       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
    </div>

    <div v-else-if="!budgetStore.isLoadingTransactions && budgetStore.transactionsList.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mb-2 text-gray-400">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
      <p>Belum ada transaksi yang tercatat.</p>
    </div>

    <div v-else class="space-y-4 relative">
       <div v-if="budgetStore.isLoadingTransactions" class="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 rounded-xl flex items-center justify-center"></div>

      <TransactionItem 
        v-for="transaction in budgetStore.transactionsList"
        :key="transaction.id"
        :transaction="transaction"
        :isDeleting="budgetStore.isDeletingTransactionId === transaction.id"
        @edit="handleEditClick"
        @delete="handleDeleteClick"
      />
    </div>

    <div v-if="budgetStore.transactionsList.length > 0" class="mt-8 flex items-center justify-between">
       <div class="text-sm text-gray-500 dark:text-gray-400">
          Halaman <span class="font-medium">{{ budgetStore.currentPage }}</span> dari <span class="font-medium">{{ budgetStore.totalPages }}</span>
       </div>
       <div class="flex space-x-2">
         <button 
           @click="prevPage"
           :disabled="!budgetStore.hasPreviousPage || budgetStore.isLoadingTransactions"
           class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
         >
           Sebelumnya
         </button>
         <button 
           @click="nextPage"
           :disabled="!budgetStore.hasNextPage || budgetStore.isLoadingTransactions"
           class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
         >
           Selanjutnya
         </button>
       </div>
    </div>

  </div>
</template>