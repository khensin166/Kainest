<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          Halo, {{ displayName }} 👋
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ todayLabel }}</p>
      </div>
      <div v-if="hasBudgeting" class="flex gap-2">
        <router-link to="/app/budgeting"
          class="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/20 transition-all">
          <PlusIcon class="w-4 h-4" />
          Analisis Kantong
        </router-link>
        <router-link to="/app/transactions"
          class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all">
          <ChartBarIcon class="w-4 h-4" />
          Riwayat Transaksi
        </router-link>
      </div>
    </div>

    <!-- Quick Stats (hanya jika punya akses budgeting) -->
    <div v-if="hasBudgeting" class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">{{ stat.label }}</span>
          <div :class="['w-8 h-8 rounded-xl flex items-center justify-center', stat.iconBg]">
            <component :is="stat.icon" :class="['w-4 h-4', stat.iconColor]" />
          </div>
        </div>
        <p v-if="!loadingStats" class="text-lg font-bold text-gray-900 dark:text-white">{{ stat.value }}</p>
        <div v-else class="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-3/4"></div>
        <p class="text-xs mt-1" :class="stat.changeColor">{{ stat.change }}</p>
      </div>
    </div>

    <!-- Onboarding card jika belum ada budgeting -->
    <div v-else
      class="bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 rounded-2xl p-6 border border-violet-100 dark:border-violet-800">
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0">
          <SparklesIcon class="w-6 h-6 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <p class="font-semibold text-gray-900 dark:text-white">Selamat datang di Kainest!</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">Akun kamu masih dalam proses setup oleh admin. Fitur
            budgeting akan segera tersedia.</p>
        </div>
      </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { PlusIcon, ChartBarIcon, BanknotesIcon, ArrowTrendingDownIcon, SparklesIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';

const authStore = useAuthStore();
const loadingStats = ref(true);
const summaryData = ref(null);

const displayName = computed(() =>
  authStore.user?.displayName || authStore.user?.name?.split(' ')[0] || 'Kamu'
);

const hasBudgeting = computed(() =>
  authStore.user?.role === 'admin' || authStore.user?.permissions?.includes('budgeting')
);

const todayLabel = computed(() => {
  return new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
});

const formatRupiah = (num) => {
  if (num === null || num === undefined) return 'Rp -';
  return 'Rp ' + Number(num).toLocaleString('id-ID');
};

const stats = computed(() => [
  {
    label: 'Total Pengeluaran Bulan Ini',
    value: formatRupiah(summaryData.value?.data?.totals?.spent ?? 0),
    change: 'Bulan berjalan',
    icon: ArrowTrendingDownIcon,
    iconBg: 'bg-red-50 dark:bg-red-900/20',
    iconColor: 'text-red-500',
    changeColor: 'text-gray-400 dark:text-gray-500',
  },
  {
    label: 'Total Anggaran',
    value: formatRupiah(summaryData.value?.data?.totals?.limit ?? 0),
    change: 'Dari gaji bulan ini',
    icon: BanknotesIcon,
    iconBg: 'bg-green-50 dark:bg-green-900/20',
    iconColor: 'text-green-500',
    changeColor: 'text-gray-400 dark:text-gray-500',
  },
  {
    label: 'Sisa Anggaran',
    value: formatRupiah(summaryData.value?.data?.totals?.remaining ?? 0),
    change: 'Sampai akhir bulan',
    icon: SparklesIcon,
    iconBg: 'bg-violet-50 dark:bg-violet-900/20',
    iconColor: 'text-violet-500',
    changeColor: 'text-gray-400 dark:text-gray-500',
  },
]);

onMounted(async () => {
  if (!hasBudgeting.value) {
    loadingStats.value = false;
    return;
  }
  try {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const res = await axios.get(`${baseUrl}/budget/summary`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      withCredentials: true,
    });
    summaryData.value = res.data;
  } catch (e) {
    console.warn('[DashboardWelcome] Gagal fetch summary:', e.message);
  } finally {
    loadingStats.value = false;
  }
});
</script>
