<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <div class="mb-4 sm:mb-0 flex items-center gap-3">
        <h1 class="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">
          Rekap Bulanan
        </h1>
        <PageGuide :steps="pageGuides.history" />
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Tinjauan keuangan Anda dari bulan ke bulan — lihat pola pemasukan dan pengeluaran Anda dari waktu ke waktu.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="budgetStore.isLoadingHistory" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
    </div>

    <!-- Empty State -->
    <BaseEmptyState v-else-if="budgetStore.historyList.length === 0" icon="📭" title="Belum ada riwayat"
      message="Riwayat akan muncul otomatis setiap bulan Anda menggunakan dashboard." />

    <template v-else>
      <!-- ─────────────────────────────────────────── -->
      <!-- GRAFIK MAKRO: Ringkasan Semua Bulan -->
      <!-- ─────────────────────────────────────────── -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div>
            <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Perbandingan Bulanan</h2>
            <p class="text-xs text-gray-400 dark:text-gray-500">
              Batang <span class="text-emerald-500 font-medium">Hijau Terang</span> = Pemasukan &nbsp;|&nbsp;
              Batang <span class="text-red-400 font-medium">Merah</span> = Pengeluaran &nbsp;|&nbsp;
              Batang <span class="text-emerald-700 font-medium">Hijau Gelap</span> = Tabungan
            </p>
          </div>
          <div class="w-full sm:w-48 shrink-0 relative z-20">
            <DropdownSelect v-model="periodFilter" :options="periodOptions" label="" placeholder="Pilih Rentang"
              class="w-full" />
          </div>
        </div>
        <div class="relative h-64">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- ─────────────────────────────────────────── -->
      <!-- DAFTAR KARTU RIWAYAT PER BULAN (Akordion) -->
      <!-- ─────────────────────────────────────────── -->
      <div class="space-y-4">
        <div v-for="item in budgetStore.historyList" :key="item.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200">
          <!-- Header Kartu: Selalu Terlihat -->
          <button
            class="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            @click="toggleCard(item.id)">
            <div class="flex items-center gap-4">
              <!-- Periode Bulan -->
              <div
                class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <span class="text-lg font-bold text-violet-600 dark:text-violet-400">
                  {{ formatMonthShort(item.period) }}
                </span>
              </div>
              <div class="text-left">
                <p class="font-semibold text-gray-800 dark:text-gray-200">{{ formatPeriodFull(item.period) }}</p>
              </div>
            </div>

            <!-- Ringkasan Numerik -->
            <div class="hidden sm:flex items-center gap-6 text-right">
              <div>
                <p class="text-[10px] text-gray-400 uppercase tracking-wide">Pemasukan</p>
                <p class="text-sm font-bold text-emerald-500">{{ formatRupiah(item.totalIncome) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 uppercase tracking-wide">Pengeluaran</p>
                <p class="text-sm font-bold"
                  :class="(item.totalSpent > item.totalIncome && item.totalIncome > 0) ? 'text-red-500' : 'text-red-400'">
                  {{ formatRupiah(item.totalSpent) }}
                </p>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 uppercase tracking-wide">Tabungan</p>
                <p class="text-sm font-bold text-emerald-700 dark:text-emerald-300">{{ formatRupiah(item.totalSaved) }}
                </p>
              </div>
              <ChevronDownIcon class="w-5 h-5 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': expandedIds.has(item.id) }" />
            </div>
            <ChevronDownIcon class="sm:hidden w-5 h-5 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': expandedIds.has(item.id) }" />
          </button>

          <!-- Body Akordion: Hanya Muncul Saat Diklik -->
          <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[1500px]" leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-[1500px]" leave-to-class="opacity-0 max-h-0">
            <div v-show="expandedIds.has(item.id)" class="border-t border-gray-100 dark:border-gray-700">
              <div class="px-6 py-6 space-y-8">

                <!-- Ringkasan Mobile -->
                <div class="sm:hidden grid grid-cols-3 gap-3">
                  <div class="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide">Pemasukan</p>
                    <p class="text-sm font-bold text-emerald-500">{{ formatRupiah(item.totalIncome) }}</p>
                  </div>
                  <div class="text-center p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide">Pengeluaran</p>
                    <p class="text-sm font-bold text-red-500">{{ formatRupiah(item.totalSpent) }}</p>
                  </div>
                  <div class="text-center p-2 bg-emerald-100 dark:bg-emerald-800/20 rounded-lg">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide">Tabungan</p>
                    <p class="text-sm font-bold text-emerald-700 dark:text-emerald-300">{{ formatRupiah(item.totalSaved)
                      }}</p>
                  </div>
                </div>

                <!-- Split Panel: Donut Chart & List -->
                <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

                  <!-- Donut Chart -->
                  <div class="md:col-span-4 lg:col-span-3 flex flex-col items-center">
                    <p
                      class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 w-full text-center">
                      Alokasi Pengeluaran
                    </p>
                    <div class="relative w-48 h-48 mb-2">
                      <Doughnut v-if="getDonutData(item).datasets[0].data.length > 0" :data="getDonutData(item)"
                        :options="donutOptions" />
                      <div v-else
                        class="absolute inset-0 flex items-center justify-center text-xs text-gray-400 text-center px-2">
                        Belum ada pengeluaran</div>
                    </div>
                  </div>

                  <!-- Rincian Kantong List -->
                  <div class="md:col-span-8 lg:col-span-9">
                    <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                      🗂️ Peringkat Pengeluaran Kantong
                    </p>

                    <div v-if="parsedPockets(item.pocketsSnapshot).length > 0"
                      class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div v-for="(pocket, index) in sortedPockets(item.pocketsSnapshot)" :key="pocket.categoryId"
                        class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl">
                        <div class="text-lg w-8 text-center font-bold text-gray-300 dark:text-gray-600">#{{ index + 1 }}
                        </div>
                        <span class="text-2xl">{{ pocket.icon || '💼' }}</span>
                        <div class="flex-1 w-full">
                          <div class="flex justify-between items-center mb-1">
                            <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ pocket.categoryName }}
                            </p>
                          </div>
                          <p class="text-xs text-gray-400">
                            <span class="text-red-500 font-semibold">
                              {{ formatRupiah(pocket.spent || 0) }}
                            </span>
                            <span class="text-[10px] ml-1 opacity-70">dari {{ formatRupiah(pocket.limitAmount) }}</span>
                          </p>
                          <!-- Progress Bar -->
                          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1.5 overflow-hidden">
                            <div class="h-1.5 rounded-full transition-all duration-300"
                              :class="(pocket.spent || 0) > pocket.limitAmount ? 'bg-red-500' : 'bg-red-400'"
                              :style="{ width: Math.min(((pocket.spent || 0) / (pocket.limitAmount || 1)) * 100, 100) + '%' }">
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p v-else class="text-xs text-gray-400 italic">Tidak ada data kantong.</p>
                  </div>
                </div>

                <!-- Evaluasi AI (jika tersedia) -->
                <div v-if="item.aiEvaluation"
                  class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 mt-4">
                  <div class="flex items-start gap-2">
                    <span class="text-lg shrink-0">🤖</span>
                    <div>
                      <p class="text-xs font-semibold text-amber-800 dark:text-amber-400 mb-1">Evaluasi AI</p>
                      <p class="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">{{ item.aiEvaluation }}</p>
                    </div>
                  </div>
                </div>

                <!-- Overbudget Warning -->
                <div
                  v-if="(item.totalSpent > item.totalIncome && item.totalIncome > 0) || (item.totalSpent > item.totalBudgeted && item.totalIncome === 0)"
                  class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-xl mt-4">
                  <span class="text-base">⚠️</span>
                  <p class="text-xs text-red-600 dark:text-red-400">
                    Pengeluaran bulan ini melebihi pemasukan/budget sebesar
                    <strong>{{ formatRupiah(item.totalSpent - (item.totalIncome || item.totalBudgeted)) }}</strong>
                  </p>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement, DoughnutController } from 'chart.js';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useBudgetStore } from '../stores/useBudgetStore';
import BaseEmptyState from '@/components/BaseEmptyState.vue';
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';
import { formatRupiah } from '@/utils/Utils';
import DropdownSelect from '@/components/forms/DropdownSelect.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement, DoughnutController);

const budgetStore = useBudgetStore();
const expandedIds = ref(new Set());

// State for filter
const periodFilter = ref(6);
const periodOptions = [
  { label: '3 Bulan Terakhir', value: 3 },
  { label: '6 Bulan Terakhir', value: 6 },
  { label: '12 Bulan Terakhir', value: 12 },
  { label: 'Semua Riwayat', value: 0 }
];

onMounted(async () => {
  await budgetStore.fetchMonthlyHistory();
  if (budgetStore.historyList.length > 0) {
    expandedIds.value.add(budgetStore.historyList[0].id);
    expandedIds.value = new Set(expandedIds.value);
  }
});

// === Helpers ===
const formatMonthShort = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { month: 'short' }).toUpperCase();
};

const formatPeriodFull = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
};

const parsedPockets = (snapshot) => {
  if (!snapshot) return [];
  try {
    const arr = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot;
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const sortedPockets = (snapshot) => {
  const pockets = parsedPockets(snapshot);
  return pockets.sort((a, b) => (b.spent || 0) - (a.spent || 0));
};

const toggleCard = (id) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id);
  } else {
    expandedIds.value.add(id);
  }
  // Trigger reactivity pada Set
  expandedIds.value = new Set(expandedIds.value);
};

// === Chart Data (Bar) ===
const filteredHistoryList = computed(() => {
  if (periodFilter.value === 0) return budgetStore.historyList;
  return budgetStore.historyList.slice(0, periodFilter.value);
});

const chartData = computed(() => {
  const list = [...filteredHistoryList.value].reverse(); // Urut dari yang terlama
  return {
    labels: list.map(item => formatPeriodFull(item.period)),
    datasets: [
      {
        label: 'Pemasukan',
        data: list.map(item => item.totalIncome || item.totalBudgeted), // Fallback ke budgeted untuk data lama
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald Terang
        borderRadius: 6,
      },
      {
        label: 'Pengeluaran Aktual',
        data: list.map(item => item.totalSpent),
        backgroundColor: 'rgba(239, 68, 68, 0.8)', // Red
        borderRadius: 6,
      },
      {
        label: 'Tabungan',
        data: list.map(item => item.totalSaved),
        backgroundColor: 'rgba(4, 120, 87, 0.8)', // Emerald Gelap
        borderRadius: 6,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { boxWidth: 12, padding: 16, font: { size: 12 } },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return ` ${context.dataset.label}: ${formatRupiah(context.parsed.y)}`;
        },
      },
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 } } },
    y: {
      grid: { color: 'rgba(156,163,175,0.15)' },
      ticks: {
        font: { size: 11 },
        callback: (value) => 'Rp ' + (value / 1000000).toFixed(1) + 'jt',
      },
    },
  },
};

// === Chart Data (Donut) ===
const getDonutData = (item) => {
  const pockets = sortedPockets(item.pocketsSnapshot).filter(p => (p.spent || 0) > 0);

  // Preset warna (Tailwind colors)
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'
  ];

  return {
    labels: pockets.map(p => p.categoryName),
    datasets: [{
      data: pockets.map(p => p.spent || 0),
      backgroundColor: pockets.map((_, i) => colors[i % colors.length]),
      borderWidth: 0,
      hoverOffset: 4
    }]
  };
};

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '65%',
  plugins: {
    legend: { display: false }, // Disembunyikan karena sudah ada list di kanannya
    tooltip: {
      callbacks: {
        label: (context) => ` ${context.label}: ${formatRupiah(context.raw)}`
      }
    }
  }
};
</script>
