<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Riwayat Keuangan Bulanan</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Tinjauan keuangan Anda dari bulan ke bulan — lihat pola boros dan hemat Anda dari waktu ke waktu.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="budgetStore.isLoadingHistory" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
    </div>

    <!-- Empty State -->
    <BaseEmptyState 
      v-else-if="budgetStore.historyList.length === 0"
      icon="📭"
      title="Belum ada riwayat"
      message="Riwayat akan muncul otomatis setiap bulan Anda menggunakan dashboard."
    />

    <template v-else>
      <!-- ─────────────────────────────────────────── -->
      <!-- GRAFIK MAKRO: Ringkasan Semua Bulan -->
      <!-- ─────────────────────────────────────────── -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8">
        <h2 class="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">Perbandingan Bulanan</h2>
        <p class="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Batang <span class="text-violet-500 font-medium">Ungu</span> = Rencana Budget &nbsp;|&nbsp;
          Batang <span class="text-red-400 font-medium">Merah</span> = Pengeluaran Aktual &nbsp;|&nbsp;
          Batang <span class="text-emerald-400 font-medium">Hijau</span> = Ditabung
        </p>
        <div class="relative h-64">
          <Bar :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- ─────────────────────────────────────────── -->
      <!-- DAFTAR KARTU RIWAYAT PER BULAN (Akordion) -->
      <!-- ─────────────────────────────────────────── -->
      <div class="space-y-4">
        <div
          v-for="item in budgetStore.historyList"
          :key="item.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-200"
        >
          <!-- Header Kartu: Selalu Terlihat -->
          <button
            class="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            @click="toggleCard(item.id)"
          >
            <div class="flex items-center gap-4">
              <!-- Periode Bulan -->
              <div class="w-12 h-12 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
                <span class="text-lg font-bold text-violet-600 dark:text-violet-400">
                  {{ formatMonthShort(item.period) }}
                </span>
              </div>
              <div class="text-left">
                <p class="font-semibold text-gray-800 dark:text-gray-200">{{ formatPeriodFull(item.period) }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Gaji: <span class="text-gray-600 dark:text-gray-300 font-medium">{{ formatRupiah(item.salarySnapshot) }}</span>
                </p>
              </div>
            </div>

            <!-- Ringkasan Numerik -->
            <div class="hidden sm:flex items-center gap-6 text-right">
              <div>
                <p class="text-[10px] text-gray-400 uppercase tracking-wide">Rencana</p>
                <p class="text-sm font-bold text-violet-600 dark:text-violet-400">{{ formatRupiah(item.totalBudgeted) }}</p>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 uppercase tracking-wide">Aktual</p>
                <p class="text-sm font-bold" :class="item.totalSpent > item.totalBudgeted ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'">
                  {{ formatRupiah(item.totalSpent) }}
                </p>
              </div>
              <div>
                <p class="text-[10px] text-gray-400 uppercase tracking-wide">Tabungan</p>
                <p class="text-sm font-bold text-emerald-500">{{ formatRupiah(item.totalSaved) }}</p>
              </div>
              <ChevronDownIcon
                class="w-5 h-5 text-gray-400 transition-transform duration-200"
                :class="{ 'rotate-180': expandedIds.has(item.id) }"
              />
            </div>
            <ChevronDownIcon
              class="sm:hidden w-5 h-5 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': expandedIds.has(item.id) }"
            />
          </button>

          <!-- Body Akordion: Hanya Muncul Saat Diklik -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 max-h-0"
            enter-to-class="opacity-100 max-h-[500px]"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 max-h-[500px]"
            leave-to-class="opacity-0 max-h-0"
          >
            <div v-show="expandedIds.has(item.id)" class="border-t border-gray-100 dark:border-gray-700">
              <div class="px-6 py-4 space-y-4">
                <!-- Ringkasan Mobile -->
                <div class="sm:hidden grid grid-cols-3 gap-3 mb-2">
                  <div class="text-center p-2 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide">Rencana</p>
                    <p class="text-sm font-bold text-violet-600 dark:text-violet-400">{{ formatRupiah(item.totalBudgeted) }}</p>
                  </div>
                  <div class="text-center p-2 rounded-lg" :class="item.totalSpent > item.totalBudgeted ? 'bg-red-50 dark:bg-red-900/20' : 'bg-gray-50 dark:bg-gray-700/30'">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide">Aktual</p>
                    <p class="text-sm font-bold" :class="item.totalSpent > item.totalBudgeted ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'">{{ formatRupiah(item.totalSpent) }}</p>
                  </div>
                  <div class="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                    <p class="text-[10px] text-gray-400 uppercase tracking-wide">Tabungan</p>
                    <p class="text-sm font-bold text-emerald-500">{{ formatRupiah(item.totalSaved) }}</p>
                  </div>
                </div>

                <!-- Rincian Kantong (dari pocketsSnapshot JSON) -->
                <div>
                  <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    🗂️ Rincian Kantong Bulan Ini
                  </p>
                  <div
                    v-if="parsedPockets(item.pocketsSnapshot).length > 0"
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
                  >
                    <div
                      v-for="pocket in parsedPockets(item.pocketsSnapshot)"
                      :key="pocket.categoryId"
                      class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-xl"
                    >
                      <span class="text-2xl">{{ pocket.icon || '💼' }}</span>
                      <div class="flex-1 w-full">
                        <div class="flex justify-between items-center mb-1">
                          <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ pocket.categoryName }}</p>
                        </div>
                        <p class="text-xs text-gray-400">
                          <span :class="(pocket.spent || 0) > pocket.limitAmount ? 'text-red-500 font-semibold' : 'text-gray-600 dark:text-gray-300'">
                            {{ formatRupiah(pocket.spent || 0) }}
                          </span>
                          / {{ formatRupiah(pocket.limitAmount) }}
                        </p>
                        <!-- Progress Bar (Optional) -->
                        <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-1.5 overflow-hidden">
                          <div class="h-1.5 rounded-full transition-all duration-300"
                            :class="(pocket.spent || 0) > pocket.limitAmount ? 'bg-red-500' : 'bg-violet-500'"
                            :style="{ width: Math.min(((pocket.spent || 0) / (pocket.limitAmount || 1)) * 100, 100) + '%' }">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p v-else class="text-xs text-gray-400 italic">Tidak ada data kantong.</p>
                </div>

                <!-- Evaluasi AI (jika tersedia) -->
                <div v-if="item.aiEvaluation" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50">
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
                  v-if="item.totalSpent > item.totalBudgeted"
                  class="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-xl"
                >
                  <span class="text-base">⚠️</span>
                  <p class="text-xs text-red-600 dark:text-red-400">
                    Pengeluaran bulan ini melebihi rencana sebesar
                    <strong>{{ formatRupiah(item.totalSpent - item.totalBudgeted) }}</strong>
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
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { ChevronDownIcon } from '@heroicons/vue/24/outline';
import { useBudgetStore } from '../stores/useBudgetStore';
import BaseEmptyState from '@/components/BaseEmptyState.vue';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const budgetStore = useBudgetStore();
const expandedIds = ref(new Set());

onMounted(async () => {
  await budgetStore.fetchMonthlyHistory();
});

// === Helpers ===

const formatRupiah = (value) => {
  if (!value && value !== 0) return 'Rp -';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

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

const toggleCard = (id) => {
  if (expandedIds.value.has(id)) {
    expandedIds.value.delete(id);
  } else {
    expandedIds.value.add(id);
  }
  // Trigger reactivity pada Set
  expandedIds.value = new Set(expandedIds.value);
};

// === Chart Data ===
const chartData = computed(() => {
  const list = [...budgetStore.historyList].reverse(); // Urut dari yang terlama
  return {
    labels: list.map(item => formatPeriodFull(item.period)),
    datasets: [
      {
        label: 'Rencana Budget',
        data: list.map(item => item.totalBudgeted),
        backgroundColor: 'rgba(124, 58, 237, 0.7)', // Violet
        borderRadius: 6,
      },
      {
        label: 'Pengeluaran Aktual',
        data: list.map(item => item.totalSpent),
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red
        borderRadius: 6,
      },
      {
        label: 'Tabungan',
        data: list.map(item => item.totalSaved),
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // Emerald
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
      labels: {
        boxWidth: 12,
        padding: 16,
        font: { size: 12 },
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          return ` ${context.dataset.label}: ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(context.parsed.y)}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 11 } },
    },
    y: {
      grid: { color: 'rgba(156,163,175,0.15)' },
      ticks: {
        font: { size: 11 },
        callback: (value) => 'Rp ' + (value / 1000000).toFixed(1) + 'jt',
      },
    },
  },
};
</script>
