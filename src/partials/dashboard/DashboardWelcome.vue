<template>
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">
          Halo, {{ displayName }} 👋
        </h1>
        <p class="text-sm text-text-muted mt-0.5">{{ todayLabel }}</p>
      </div>
      <div v-if="hasBudgeting" class="flex gap-2">
        <router-link to="/app/budgeting"
          class="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-text-inverse text-sm font-semibold rounded-xl shadow-none transition-all">
          <BanknotesIcon class="w-4 h-4" />
          Kantong Keuangan
        </router-link>
        <router-link to="/app/history"
          class="flex items-center gap-2 px-4 py-2 bg-surface-card hover:bg-surface-hover text-text-primary text-sm font-semibold rounded-xl border border-border-default transition-all">
          <ChartBarIcon class="w-4 h-4" />
          Rekap Bulanan
        </router-link>
      </div>
    </div>

    <!-- Quick Stats (hanya jika punya akses budgeting) -->
    <div v-if="hasBudgeting" class="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-surface-card rounded-2xl p-4 border border-border-default shadow-none hover:border-border-strong transition-colors"
        :class="stat.cardClass || ''">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium" :class="stat.labelClass || 'text-text-muted'">{{ stat.label }}</span>
          <div :class="['w-8 h-8 rounded-xl flex items-center justify-center', stat.iconBg]">
            <component :is="stat.icon" :class="['w-4 h-4', stat.iconColor]" />
          </div>
        </div>
        <p v-if="!loadingStats" class="text-lg font-bold text-text-primary" :class="stat.valueClass || ''">{{ stat.value }}</p>
        <div v-else class="h-6 bg-surface-hover rounded-lg animate-pulse w-3/4"></div>
        <!-- MoM Badge -->
        <div class="mt-2 flex items-center gap-1">
          <template v-if="stat.mom !== null && stat.mom !== undefined">
            <span class="inline-flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md"
              :class="(
                stat.momInvert
                  ? (stat.mom > 0 ? 'text-status-danger bg-status-danger/20' : 'text-status-success bg-status-success/20')
                  : (stat.mom >= 0 ? 'text-status-success bg-status-success/20' : 'text-status-danger bg-status-danger/20')
              )">
              <component :is="stat.mom >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon" class="w-3 h-3" />
              {{ stat.mom > 0 ? '+' : '' }}{{ stat.mom }}%
            </span>
            <span class="text-[10px] text-text-muted">vs bln lalu</span>
          </template>
          <span v-else class="text-[10px] text-text-muted">{{ stat.change }}</span>
        </div>
        <p v-if="stat.tooltip" class="text-[10px] text-text-muted mt-1 leading-tight italic">{{ stat.tooltip }}</p>
      </div>
    </div>


    <!-- Onboarding card jika belum ada budgeting -->
    <div v-else
      class="bg-brand-surface rounded-2xl p-6 border border-brand-soft">
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center flex-shrink-0">
          <SparklesIcon class="w-6 h-6 text-brand-primary" />
        </div>
        <div>
          <p class="font-semibold text-text-primary">Selamat datang di Kainest!</p>
          <p class="text-sm text-text-muted">Akun kamu masih dalam proses setup oleh admin. Fitur
            budgeting akan segera tersedia.</p>
        </div>
      </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { PlusIcon, ChartBarIcon, BanknotesIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon, SparklesIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
import axios from 'axios';
import { formatRupiah } from '@/utils/Utils';

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


// Helper: ambil nilai MoM dari response summary
const mom = computed(() => summaryData.value?.data?.totals?.mom ?? {});

const stats = computed(() => [
  {
    label: 'Total Pengeluaran Bulan Ini',
    value: formatRupiah(summaryData.value?.data?.totals?.spent ?? 0),
    change: 'Bulan berjalan',
    icon: ArrowTrendingDownIcon,
    iconBg: 'bg-status-danger/10',
    iconColor: 'text-status-danger',
    changeColor: 'text-text-muted',
    mom: mom.value.spent,
    momInvert: true, // Pengeluaran naik = Merah (buruk)
  },
  {
    label: 'Gaji Utama',
    value: formatRupiah(summaryData.value?.data?.salary ?? 0),
    change: 'Dari gaji bulan ini',
    icon: BanknotesIcon,
    iconBg: 'bg-status-success/10',
    iconColor: 'text-status-success',
    changeColor: 'text-text-muted',
    mom: mom.value.limit,
    momInvert: false,
  },
  {
    label: 'Sisa Gaji Pokok',
    value: formatRupiah(summaryData.value?.data?.totals?.remaining ?? 0),
    change: 'Sampai akhir bulan',
    icon: SparklesIcon,
    iconBg: 'bg-brand-surface',
    iconColor: 'text-brand-primary',
    changeColor: 'text-text-muted',
    mom: mom.value.remaining,
    momInvert: false,
  },
  {
    label: 'Pemasukan Tambahan',
    value: formatRupiah(summaryData.value?.data?.totals?.additionalIncome ?? 0),
    change: 'Uang ekstra bulan ini',
    icon: PlusCircleIcon,
    iconBg: 'bg-brand-surface',
    iconColor: 'text-brand-primary',
    changeColor: 'text-brand-muted',
    cardClass: 'border-brand-soft bg-brand-surface/50',
    labelClass: 'text-brand-primary',
    valueClass: 'text-text-primary',
    tooltip: 'Di luar gaji pokok. Opsional untuk dialokasikan ke kantong.',
    mom: mom.value.additionalIncome,
    momInvert: false,
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
