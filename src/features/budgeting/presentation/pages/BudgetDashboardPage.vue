<!-- BudgetDashboard -->
<script setup>
import { onMounted, ref, provide, computed, onActivated } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import BudgetHeroCard from '../components/BudgetHeroCard.vue';
import BudgetCategoryCard from '../components/BudgetCategoryCard.vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import TransactionForm from '../components/TransactionForm.vue';
import SpendingTrendChart from '../components/SpendingTrendChart.vue';
import BudgetSetupModal from '../components/BudgetSetupModal.vue';

// Inisialisasi store
const budgetStore = useBudgetStore();

const isTransactionModalOpen = ref(false);
const selectedTransactionToEdit = ref(null);

const selectedTransactionId = computed(() => selectedTransactionToEdit.value?.id || null);

const openTransactionModal = () => {
  selectedTransactionToEdit.value = null; // RESET state edit
  console.log("🔓 openTransactionModal dipanggil. isTransactionModalOpen = true");
  isTransactionModalOpen.value = true;
  isTransactionModalOpen.value = true;
};

const isSetupModalOpen = ref(false);
const openSetupModal = () => {
  isSetupModalOpen.value = true;
};
const closeSetupModal = () => {
  isSetupModalOpen.value = false;
};

// Fungsi ini yang akan kita "provide"
const closeTransactionModal = () => {
  console.log("🔒 closeTransactionModal dipanggil lewat Inject. isTransactionModalOpen = false");
  isTransactionModalOpen.value = false;
};

const handleEditTransaction = (transactionData) => {
  console.log("📝 Membuka modal EDIT untuk:", transactionData.categoryName);
  selectedTransactionToEdit.value = transactionData; // SET state edit dengan data yang diterima
  isTransactionModalOpen.value = true; // Buka modal yang sama
}
// 2. Lakukan Provide. Kita beri nama kuncinya 'closeModalFunc'
provide('closeModalFunc', closeTransactionModal);

// Panggil data saat komponen dimount (dibuka pertama kali)
onMounted(() => {
  if (!budgetStore.hasData) {
    budgetStore.fetchDashboardSummary();
    budgetStore.fetchSpendingTrend();
  }
});

onActivated(() => {
  console.log("👀 User kembali melihat Dashboard, cek data baru...");

  budgetStore.fetchDashboardSummary();
  budgetStore.fetchSpendingTrend();
});
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

    <div class="sm:flex sm:justify-between sm:items-center mb-8">
      <div class="mb-4 sm:mb-0">
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Dashboard Keuangan
        </h1>
      </div>
      <div class="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
        <button @click="openSetupModal"
          class="btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-500 dark:text-gray-400">
          <span class="sr-only">Settings</span>
          <svg class="w-4 h-4 fill-current" viewBox="0 0 16 16">
            <path
              d="M11.7.2l-.4.3c-.4.3-.9.4-1.3.1l-.3-.4c-.3-.4 0-1 .5-1.3l.4-.3c.4-.3.9-.4 1.3-.1l.3.4c.3.5 0 1-.5 1.3zm3.7 3.5l-.3.3c-.3.4-.4.9-.1 1.3l.4.3c.4.3 1 0 1.3-.5l.3-.3c.3-.4.4-.9.1-1.3l-.4-.3c-.5-.4-1.1-.1-1.3.5zM2 11.2l.3.4c.3.4.9.4 1.3.1l.4-.3c.4-.3 0-1-.5-1.3l-.3-.4c-.3-.4-.9-.4-1.3-.1l-.4.3c-.4.4 0 1 .5 1.3zm12.3 2.1l-.4.3c-.4.3-.9.4-1.3.1l-.3-.4c-.3-.4 0-1 .5-1.3l.4-.3c.4-.3.9-.4 1.3-.1l.3.4c.4.3 0 1-.5 1.3zM1.7 5.2l.4.3c.5.4 1 .1 1.3-.5l.3-.3c.3-.4.1-1-.3-1.3l-.4-.3c-.5-.4-1-.1-1.3.5l-.3.3c-.3.4-.1 1 .3 1.3zM8 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z" />
          </svg>
        </button>
        <button @click="openTransactionModal" class="btn bg-violet-600 hover:bg-violet-700 text-white">
          <svg class="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
            <path
              d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span class="hidden xs:block ml-2">Catat Pengeluaran</span>
        </button>
      </div>
    </div>

    <div v-if="budgetStore.isLoadingSummary" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
    </div>

    <div v-else-if="budgetStore.errorSummary"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Terjadi Kesalahan!</strong>
      <span class="block sm:inline"> {{ budgetStore.errorSummary }}</span>
      <button @click="budgetStore.fetchDashboardSummary()" class="mt-2 underline">Coba Lagi</button>
    </div>

    <div v-else-if="budgetStore.hasData" class="grid grid-cols-12 gap-6">

      <BudgetHeroCard :totalRemaining="budgetStore.totalRemaining" :monthName="budgetStore.currentPeriodMonth"
        :trendData="budgetStore.chartDataCollection" />

      <div
        class="flex flex-col col-span-full sm:col-span-6 xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-100 dark:border-gray-700/60">
        <header class="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
          <h2 class="font-semibold text-gray-800 dark:text-gray-100">Tren Pengeluaran Bulan Ini</h2>
        </header>

        <div class="p-5">
          <div v-if="budgetStore.isLoadingTrend" class="flex justify-center items-center h-72">
            <div class="animate-pulse flex flex-col items-center text-gray-400">
              <svg class="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path>
              </svg>
              <span>Memuat grafik...</span>
            </div>
          </div>

          <div v-else-if="budgetStore.chartDataCollection" class="h-72">
            <SpendingTrendChart :chartData="budgetStore.chartDataCollection" />
          </div>

          <div v-else class="h-72 flex items-center justify-center text-gray-400">
            Belum ada data tren tersedia.
          </div>
        </div>
      </div>

      <div class="col-span-full mt-4 mb-2">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Rincian Kategori</h2>
      </div>

      <BudgetCategoryCard v-for="category in budgetStore.budgetCategories" :key="category.categoryId"
        :category="category" />


      <BaseModal :isOpen="isTransactionModalOpen" @close="closeTransactionModal" size="md" :hideFooter="true">
        <template #header>
          {{ selectedTransactionId ? 'Edit Transaksi' : 'Catat Pengeluaran Baru' }}
        </template>
        <template #body>
          <TransactionForm :initialData="selectedTransactionToEdit" :transactionId="selectedTransactionId" />
        </template>
      </BaseModal>

      <BaseModal :isOpen="isSetupModalOpen" @close="closeSetupModal" size="md" :hideFooter="true">
        <template #header>Konfigurasi Budget</template>
        <template #body>
          <BudgetSetupModal @close="closeSetupModal" />
        </template>
      </BaseModal>
    </div>
  </div>
</template>