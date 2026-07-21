<!-- BudgetDashboard -->
<script setup>
import { onMounted, ref, provide, computed, onActivated, nextTick } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import BudgetHeroCard from '../components/BudgetHeroCard.vue';
import BudgetCategoryCard from '../components/BudgetCategoryCard.vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import TransactionForm from '../components/TransactionForm.vue';
import SpendingTrendChart from '../components/SpendingTrendChart.vue';
import PocketManagementModal from '../components/PocketManagementModal.vue';
import BudgetSetupModal from '../components/BudgetSetupModal.vue';
import PageGuide from '@/components/PageGuide.vue';
import Tooltip from '@/components/Tooltip.vue';
import { pageGuides } from '@/config/pageGuides';

// Inisialisasi store
const budgetStore = useBudgetStore();

const isTransactionModalOpen = ref(false);
const selectedTransactionToEdit = ref(null);

const selectedTransactionId = computed(() => selectedTransactionToEdit.value?.id || null);

const openTransactionModal = () => {
  selectedTransactionToEdit.value = null; // RESET state edit
  console.log("🔓 openTransactionModal dipanggil. isTransactionModalOpen = true");
  isTransactionModalOpen.value = true;
};

const isPocketModalOpen = ref(false);
const openPocketModal = () => {
  isPocketModalOpen.value = true;
};
const closePocketModal = async (payload) => {
  // 1. Matikan modal
  isPocketModalOpen.value = false;

  // 2. Gunakan nextTick agar Vue selesai membuang modal dari DOM (mencegah glitch UI)
  await nextTick();

  // 3. Jika payload memiliki refresh: true, panggil API di background
  if (payload && payload.refresh) {
    console.log("🔄 Me-refresh Dashboard secara background setelah modal tertutup rapat...");
    await budgetStore.fetchDashboardSummary();
  }
};

// State untuk Modal Setup
const isSetupModalOpen = ref(false);
const isSetupForced = ref(false);

const closeSetupModal = async (payload) => {
  isSetupModalOpen.value = false;

  await nextTick();

  if (payload && payload.refresh) {
    console.log("🔄 Me-refresh Dashboard secara background setelah modal setup tertutup...");
    await budgetStore.fetchDashboardSummary();
    // Juga ambil data kantong terbaru agar cek onboarding akurat
    await budgetStore.fetchPockets();
  }

  if (isSetupForced.value) {
    checkAndForceSetup();
  }

  // 🌟 Onboarding Seamless: Jika gaji sudah diisi tapi belum ada kantong sama sekali,
  // langsung buka PocketManagementModal agar user tidak perlu mencari tombolnya.
  if (budgetStore.salary > 0 && budgetStore.pocketsList.length === 0) {
    console.log("🎯 Onboarding: Gaji terisi tapi kantong masih kosong. Buka Pocket Modal otomatis...");
    await nextTick();
    isPocketModalOpen.value = true;
  }
};


const checkAndForceSetup = () => {
  // Jika data sudah diload dan salary masih 0, force setup!
  if (budgetStore.hasData && budgetStore.salary === 0) {
    isSetupForced.value = true;
    isSetupModalOpen.value = true;
  } else if (budgetStore.hasData && budgetStore.salary > 0) {
    isSetupForced.value = false;
    // Jangan set isSetupModalOpen ke false di sini, agar user bisa membukanya manual
  }
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
onMounted(async () => {
  if (!budgetStore.hasData) {
    await budgetStore.fetchDashboardSummary();
    budgetStore.fetchSpendingTrend();
  }
  checkAndForceSetup();

  // 🌟 Onboarding Seamless: Cek apakah user sudah isi gaji tapi belum buat kantong
  // Ini memastikan flow tetap berjalan meski user me-refresh halaman
  if (budgetStore.salary > 0 && !isPocketModalOpen.value) {
    await budgetStore.fetchPockets();
    if (budgetStore.pocketsList.length === 0) {
      console.log('🎯 Onboarding: Gaji ada tapi kantong kosong, buka Pocket Modal...');
      isPocketModalOpen.value = true;
    }
  }
});

onActivated(async () => {
  console.log('👀 User kembali melihat Dashboard, cek data baru...');

  await budgetStore.fetchDashboardSummary();
  budgetStore.fetchSpendingTrend();

  // Guard: jangan panggil checkAndForceSetup jika pocket modal baru saja ditutup
  if (!isPocketModalOpen.value) {
    checkAndForceSetup();

    // 🌟 Onboarding Seamless: Jika gaji sudah ada tapi kantong masih 0
    if (budgetStore.salary > 0) {
      await budgetStore.fetchPockets();
      if (budgetStore.pocketsList.length === 0) {
        console.log('🎯 Onboarding (activated): Kantong kosong, buka Pocket Modal...');
        isPocketModalOpen.value = true;
      }
    }
  }
});

</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

    <div class="sm:flex sm:justify-between sm:items-start mb-8">
      <div class="mb-4 sm:mb-0">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
            Kantong Keuangan
          </h1>
          <PageGuide :steps="pageGuides.dashboard" />
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Alokasikan dan pantau keuangan Anda ke berbagai kantong agar pengeluaran terkendali.
        </p>
      </div>
      <!-- Action Buttons: icon-only for Atur Gaji on mobile, flex-1 for others -->
      <div class="flex flex-row w-full sm:w-auto justify-start sm:justify-end gap-2">

        <!-- Atur Gaji: icon-only on mobile, icon+text on desktop -->
        <Tooltip bg="dark" size="md" position="bottom">
          <template #trigger>
            <button @click="isSetupModalOpen = true"
              class="shrink-0 btn bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-300 font-medium px-3">
              <svg class="w-4 h-4 shrink-0 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="hidden sm:inline ml-2">Atur Gaji</span>
            </button>
          </template>
          <div class="text-sm">Tetapkan total gajimu bulan ini untuk dibagi ke dalam kantong.</div>
        </Tooltip>

        <!-- Kelola Kantong: flex-1 on mobile -->
        <Tooltip bg="dark" size="md" position="bottom" class="flex-1 sm:flex-none">
          <template #trigger>
            <button @click="openPocketModal"
              class="w-full justify-center btn border-gray-200 dark:border-gray-700 font-medium transition-all"
              :class="budgetStore.salary > 0 && (!budgetStore.budgetCategories || budgetStore.budgetCategories.length === 0) ? 'bg-indigo-600 hover:bg-indigo-700 text-white ring-4 ring-indigo-500/30 shadow-lg animate-pulse border-transparent' : 'bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 text-indigo-500'">
              <!-- Wallet Icon -->
              <svg class="w-4 h-4 shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
              </svg>
              <span>Kelola Kantong</span>
            </button>
          </template>
          <div class="text-sm">Buat, edit, atau hapus kategori kantong persentase/nominal.</div>
        </Tooltip>

        <!-- Catat Transaksi: flex-1 on mobile -->
        <Tooltip bg="dark" size="md" position="bottom" class="flex-1 sm:flex-none">
          <template #trigger>
            <button @click="openTransactionModal"
              class="w-full justify-center btn bg-violet-600 hover:bg-violet-700 text-white">
              <svg class="w-4 h-4 fill-current opacity-75 shrink-0" viewBox="0 0 16 16">
                <path d="M15 7H9V1c0-.6-.4-1-1-1S7 .4 7 1v6H1c-.6 0-1 .4-1 1s.4 1 1 1h6v6c0 .6.4 1 1 1s1-.4 1-1V9h6c.6 0 1-.4 1-1s-.4-1-1-1z" />
              </svg>
              <span class="ml-2">Catat Transaksi</span>
            </button>
          </template>
          <div class="text-sm">Input transaksi (pengeluaran/pemasukan tambahan) secara manual.</div>
        </Tooltip>

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

      <BudgetHeroCard :totalRemaining="budgetStore.totalRemaining" :unallocated="budgetStore.unallocatedBudget"
        :monthName="budgetStore.currentPeriodMonth" :trendData="budgetStore.chartDataCollection"
        :totalSalary="budgetStore.salary" :totalIncome="budgetStore.totalIncome" :totalSpent="budgetStore.totalSpent"
        :momSalary="budgetStore.momLimit" :momIncome="budgetStore.momIncome" :momSpent="budgetStore.momSpent"
        :momRemaining="budgetStore.momRemaining" />

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

          <div v-else-if="budgetStore.chartDataCollection" class="h-72 relative w-full">
            <SpendingTrendChart :chartData="budgetStore.chartDataCollection" />
          </div>

          <div v-else class="h-72 flex items-center justify-center text-gray-400">
            Belum ada data tren tersedia.
          </div>
        </div>
      </div>

      <div class="mb-6 flex justify-between items-end col-span-full">
        <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">Rincian Kantong</h2>
      </div>

      <BudgetCategoryCard v-for="category in budgetStore.budgetCategories" :key="category.categoryId"
        :category="category" />


      <BaseModal :isOpen="isTransactionModalOpen" @close="closeTransactionModal" size="md" :hideFooter="true">
        <template #header>
          {{ selectedTransactionId ? 'Edit Transaksi' : 'Catat Transaksi Baru' }}
        </template>
        <template #body>
          <TransactionForm :initialData="selectedTransactionToEdit" :transactionId="selectedTransactionId" />
        </template>
      </BaseModal>

      <BaseModal :isOpen="isPocketModalOpen" @close="closePocketModal" size="2xl" :hideFooter="true">
        <template #header>Kelola Kantong (Pocket)</template>
        <template #body>
          <PocketManagementModal v-if="isPocketModalOpen" @close="closePocketModal" />
        </template>
      </BaseModal>

      <BaseModal :isOpen="isSetupModalOpen" @close="closeSetupModal" size="md" :hideFooter="true"
        :preventClose="isSetupForced">
        <template #header>Pengaturan Budget Bulanan</template>
        <template #body>
          <BudgetSetupModal @close="closeSetupModal" :forced="isSetupForced" />
        </template>
      </BaseModal>
    </div>
  </div>
</template>