<!-- BudgetDashboard -->
<script setup>
import { onMounted } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
// Import komponen-komponen yang baru kita buat
import BudgetHeroCard from '../components/BudgetHeroCard.vue';
import BudgetCategoryCard from '../components/BudgetCategoryCard.vue';

// Inisialisasi store
const budgetStore = useBudgetStore();

// Panggil data saat komponen dimount (dibuka pertama kali)
onMounted(() => {
  console.log("🖥️ [VUE PAGE] onMounted dipanggil! Memanggil store...");
  budgetStore.fetchDashboardSummary();
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
        <button class="btn bg-violet-600 hover:bg-violet-700 text-white">
          <svg class="w-4 h-4 fill-current opacity-50 shrink-0" viewBox="0 0 16 16">
            <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
          </svg>
          <span class="hidden xs:block ml-2">Catat Pengeluaran</span>
        </button>
      </div>
    </div>

    <div v-if="budgetStore.isLoadingSummary" class="flex justify-center items-center h-64">
       <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
    </div>

    <div v-else-if="budgetStore.errorSummary" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Terjadi Kesalahan!</strong>
      <span class="block sm:inline"> {{ budgetStore.errorSummary }}</span>
      <button @click="budgetStore.fetchDashboardSummary()" class="mt-2 underline">Coba Lagi</button>
    </div>

    <div v-else-if="budgetStore.hasData" class="grid grid-cols-12 gap-6">
      
      <BudgetHeroCard 
        :totalRemaining="budgetStore.totalRemaining"
        :monthName="budgetStore.currentPeriodMonth"
      />

      <div class="flex flex-col col-span-full sm:col-span-6 xl:col-span-8 bg-white dark:bg-gray-800 shadow-xs rounded-xl border border-gray-100 dark:border-gray-700/60 p-5 justify-center items-center text-gray-400 border-dashed border-2">
        Grafik Tren Pengeluaran akan muncul di sini (Next Step)
      </div>

      <div class="col-span-full mt-4 mb-2">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Rincian Kategori</h2>
      </div>
      
      <BudgetCategoryCard
        v-for="category in budgetStore.budgetCategories"
        :key="category.categoryId"
        :category="category"
      />
      
    </div>
  </div>
</template> 