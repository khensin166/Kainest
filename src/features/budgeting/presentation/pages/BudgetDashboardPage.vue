<!-- BudgetDashboard -->
<script setup>
import { IconAdd, IconCard, IconChart, IconMoney } from '@/ui/icons';
import { Button } from '@/ui';
import { onMounted, ref, provide, computed, onActivated, nextTick } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import BudgetHeroCard from '../components/BudgetHeroCard.vue';
import BudgetCategoryCard from '../components/BudgetCategoryCard.vue';
import BaseModal from '@/components/modals/BaseModal.vue';
import TransactionForm from '../components/TransactionForm.vue';
import SpendingTrendChart from '../components/SpendingTrendChart.vue';
import PocketManagementModal from '../components/PocketManagementModal.vue';
import OtherAllocationCard from '@/features/plans/presentation/components/OtherAllocationCard.vue';
import { usePlansStore } from '@/features/plans/presentation/stores/usePlansStore';
import BudgetSetupModal from '../components/BudgetSetupModal.vue';
import AiSuggestionBanner from '../components/AiSuggestionBanner.vue';
import PageGuide from '@/components/PageGuide.vue';
import Tooltip from '@/components/Tooltip.vue';
import { pageGuides } from '@/config/pageGuides';

// Inisialisasi store
const budgetStore = useBudgetStore();
const plansStore = usePlansStore();

// Kartu "Alokasi Lain" hanya memuat komitmen yang TIDAK punya kantong sendiri.
// Tagihan yang kategorinya sudah punya kantong sudah terwakili limit kantong itu;
// menghitungnya lagi membuat total alokasi di layar melebihi gaji.
const idKategoriBerkantong = computed(() =>
  (budgetStore.budgetCategories || []).map((k) => k.categoryId)
);

/** Komitmen ditarik agar kartu Alokasi Lain punya isi saat grid dirender. */
function muatKomitmen() {
  plansStore.fetchBills();
  plansStore.fetchGoals();
  plansStore.fetchHealth();
}

const isTransactionModalOpen = ref(false);
const selectedTransactionToEdit = ref(null);

const selectedTransactionId = computed(() => selectedTransactionToEdit.value?.id || null);

const openTransactionModal = () => {
  selectedTransactionToEdit.value = null; // RESET state edit
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
    await budgetStore.fetchDashboardSummary();
  }
};

// State untuk Modal Setup
const isSetupModalOpen = ref(false);
const isSetupForced = ref(false);

const closeSetupModal = async (payload) => {
  isSetupModalOpen.value = false;

  // Tunggu animasi penutupan modal selesai (BaseModal pakai duration-200)
  await nextTick();

  // Catatan: fetchDashboardSummary TIDAK dipanggil di sini.
  // BudgetSetupModal sudah memanggil action di Store saat submit,
  // sehingga data salary sudah terupdate di Store. Memanggil ulang di sini
  // hanya akan menyebabkan loading state berkedip (double-fetch).

  if (payload?.refresh) {
    isSetupForced.value = false;
  } else if (isSetupForced.value && budgetStore.salary === 0) {
    checkAndForceSetup();
  } else {
    // Setup berhasil, lepaskan flag forced
    isSetupForced.value = false;
  }

  // 🌟 Onboarding Seamless: Jika gaji sudah diisi tapi belum ada kantong sama sekali,
  // otomatis buka PocketManagementModal setelah jeda singkat.
  // Jeda 700ms memberikan kesan visual yang jelas: Modal Gaji sudah TERTUTUP PENUH,
  // baru kemudian Modal Kantong muncul sebagai langkah berikutnya.
  if (budgetStore.salary > 0 && (!budgetStore.budgetCategories || budgetStore.budgetCategories.length === 0)) {
    await new Promise(resolve => setTimeout(resolve, 700));
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
  isTransactionModalOpen.value = false;
};

const handleEditTransaction = (transactionData) => {
  selectedTransactionToEdit.value = transactionData; // SET state edit dengan data yang diterima
  isTransactionModalOpen.value = true; // Buka modal yang sama
}
// 2. Lakukan Provide. Kita beri nama kuncinya 'closeModalFunc'
provide('closeModalFunc', closeTransactionModal);

// Panggil data saat komponen dimount (dibuka pertama kali)
onMounted(async () => {
  // 🧠 Ambil saran AI budget terbaru lebih dulu — paralel, tidak perlu await
  // agar Banner AI langsung muncul tanpa menunggu loading data utama
  budgetStore.fetchAiSuggestion();
  muatKomitmen();

  if (!budgetStore.hasData) {
    await budgetStore.fetchDashboardSummary();
    budgetStore.fetchSpendingTrend();
  }
  checkAndForceSetup();

  // 🌟 Onboarding Seamless: Cek apakah user sudah isi gaji tapi belum buat kantong
  // Menggunakan budgetCategories dari data summary yang sudah dimuat di atas
  if (budgetStore.salary > 0 && !isPocketModalOpen.value) {
    if (!budgetStore.budgetCategories || budgetStore.budgetCategories.length === 0) {
      isPocketModalOpen.value = true;
    }
  }
});

onActivated(async () => {

  // 🧠 Ambil saran AI budget terbaru lebih dulu — paralel, tidak perlu await
  budgetStore.fetchAiSuggestion();
  muatKomitmen();

  await budgetStore.fetchDashboardSummary();
  budgetStore.fetchSpendingTrend();

  // Guard: jangan panggil checkAndForceSetup jika pocket modal baru saja ditutup
  if (!isPocketModalOpen.value) {
    checkAndForceSetup();

    // 🌟 Onboarding Seamless: Jika gaji sudah ada tapi kantong masih 0
    // Menggunakan budgetCategories dari summary yang baru saja di-refresh
    if (budgetStore.salary > 0 && (!budgetStore.budgetCategories || budgetStore.budgetCategories.length === 0)) {
      isPocketModalOpen.value = true;
    }
  }
});

</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

    <!-- 🧠 AI Suggestion Banner (Hanya Muncul Jika Ada Saran) -->
    <AiSuggestionBanner />

    <div class="sm:flex sm:justify-between sm:items-start mb-6">
      <div class="mb-4 sm:mb-0">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-text-primary tracking-tight">
            Kantong Keuangan
          </h1>
          <PageGuide :steps="pageGuides.budgeting" />
        </div>
        <p class="text-sm text-text-muted mt-1">
          Alokasikan dan pantau keuangan Anda ke berbagai kantong agar pengeluaran terkendali.
        </p>
      </div>
      <!-- Aksi: di layar sempit dua tombol sekunder jadi ikon sebaris, dan aksi
           utama turun ke bawah selebar layar. Sebelumnya ketiganya sebaris dengan
           dua di antaranya berlabel penuh, sehingga terpotong di layar ~412px. -->
      <div class="flex flex-col sm:flex-row w-full sm:w-auto gap-2 sm:items-center sm:justify-end">

        <!-- Sekunder: ikon saja di mobile -->
        <div class="flex gap-2">

        <Tooltip bg="dark" size="md" position="bottom">
          <template #trigger>
            <Button variant="secondary" @click="isSetupModalOpen = true" class="shrink-0">
              <IconMoney class="w-4 h-4 shrink-0 text-text-muted" aria-hidden="true" />
              <span class="hidden sm:inline ml-2">Atur Gaji</span>
            </Button>
          </template>
          <div class="text-sm">Tetapkan total gajimu bulan ini untuk dibagi ke dalam kantong.</div>
        </Tooltip>

        <Tooltip bg="dark" size="md" position="bottom">
          <template #trigger>
            <Button variant="secondary" class="shrink-0" @click="openPocketModal" :class="budgetStore.salary> 0 && (!budgetStore.budgetCategories || budgetStore.budgetCategories.length === 0) ? 'bg-brand-primary hover:bg-brand-primary-hover text-text-inverse ring-4 ring-brand-primary/20 animate-pulse border-transparent' : 'bg-surface-card hover:border-border-strong text-brand-primary'">
              <!-- Wallet Icon -->
              <IconCard class="w-4 h-4 shrink-0" aria-hidden="true" />
              <span class="hidden sm:inline ml-2">Kelola Kantong</span>
            </Button>
          </template>
          <div class="text-sm">Buat, edit, atau hapus kategori kantong persentase/nominal.</div>
        </Tooltip>

        </div>

        <!-- Aksi utama: selebar layar di mobile -->
        <Tooltip bg="dark" size="md" position="bottom" class="w-full sm:w-auto">
          <template #trigger>
            <Button variant="primary" block @click="openTransactionModal">
              <IconAdd class="w-4 h-4 fill-current opacity-75 shrink-0" aria-hidden="true" />
              <span class="ml-2">Catat Transaksi</span>
            </Button>
          </template>
          <div class="text-sm">Input transaksi (pengeluaran/pemasukan tambahan) secara manual.</div>
        </Tooltip>

      </div>
    </div>

    <div v-if="budgetStore.isLoadingSummary" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
    </div>

    <div v-else-if="budgetStore.errorSummary"
      class="bg-status-danger-bg border border-status-danger/30 text-status-danger-text px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Terjadi Kesalahan!</strong>
      <span class="block sm:inline"> {{ budgetStore.errorSummary }}</span>
      <button @click="budgetStore.fetchDashboardSummary()" class="mt-2 underline">Coba Lagi</button>
    </div>

    <div v-else-if="budgetStore.hasData" class="grid grid-cols-12 gap-6">

      <BudgetHeroCard :totalRemaining="budgetStore.totalRemaining" :unallocated="budgetStore.unallocatedBudget"
        :monthName="budgetStore.currentPeriodMonth" :trendData="budgetStore.chartDataCollection"
        :totalSalary="budgetStore.salary" :totalIncome="budgetStore.totalIncome" :totalSpent="budgetStore.totalSpent"
        :momSalary="budgetStore.momLimit" :momIncome="budgetStore.momIncome" :momSpent="budgetStore.momSpent"
        :momRemaining="budgetStore.momRemaining" :health="plansStore.health" />

      <div
        class="flex flex-col col-span-full sm:col-span-6 xl:col-span-8 bg-surface-card rounded-md border border-border-default">
        <header class="px-5 py-4 border-b border-border-muted flex items-center">
          <h2 class="font-semibold text-text-primary">Tren Pengeluaran Bulan Ini</h2>
        </header>

        <div class="p-5">
          <div v-if="budgetStore.isLoadingTrend" class="flex justify-center items-center h-72">
            <div class="animate-pulse flex flex-col items-center text-text-muted">
              <IconChart class="w-10 h-10 mb-3" aria-hidden="true" />
              <span>Memuat grafik...</span>
            </div>
          </div>

          <div v-else-if="budgetStore.chartDataCollection" class="h-72 relative w-full">
            <SpendingTrendChart :chartData="budgetStore.chartDataCollection" />
          </div>

          <div v-else class="h-72 flex items-center justify-center text-text-muted">
            Belum ada data tren tersedia.
          </div>
        </div>
      </div>

      <div class="mb-6 flex justify-between items-end col-span-full">
        <h2 class="text-xl font-bold text-text-primary">Rincian Kantong</h2>
      </div>

      <BudgetCategoryCard v-for="category in budgetStore.budgetCategories" :key="category.categoryId"
        :category="category" />

      <OtherAllocationCard :goals="plansStore.goals" :bills="plansStore.bills"
        :pocketCategoryIds="idKategoriBerkantong" />


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
          <BudgetSetupModal v-if="isSetupModalOpen" @close="closeSetupModal" :forced="isSetupForced" />
        </template>
      </BaseModal>
    </div>
  </div>
</template>