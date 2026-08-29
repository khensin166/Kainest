<script setup>
import PageGuide from '@/components/PageGuide.vue';
import { pageGuides } from '@/config/pageGuides';
import { IconAddCircle, IconAi, IconCard, IconChart, IconMoney, IconWallet } from '@/ui/icons';
import { computed, onMounted } from 'vue';
import { useAuthStore } from '@/features/auth/presentation/stores/authStore';
import { useBudgetStore } from '@/features/budgeting/presentation/stores/useBudgetStore';
import { formatRupiah } from '@/utils/Utils';
import { Button, Card, StatCard } from '@/ui';

const authStore = useAuthStore();
const budgetStore = useBudgetStore();

// Data ringkasan mengalir lewat lapisan resmi:
// store -> use case -> repository -> apiClient (interceptor 401/403 ikut aktif).
const loadingStats = computed(() => budgetStore.isLoadingSummary);

const displayName = computed(() =>
  authStore.user?.displayName || authStore.user?.name?.split(' ')[0] || 'Kamu'
);

const hasBudgeting = computed(() =>
  authStore.user?.role === 'admin' || authStore.user?.permissions?.includes('budgeting')
);

const todayLabel = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
);

const totals = computed(() => budgetStore.summaryData?.totals ?? {});
const mom = computed(() => totals.value.mom ?? {});

/** Badge MoM disembunyikan saat nilainya 0 — "0% vs bulan lalu" bukan informasi. */
const clean = (v) => (v === 0 || v === null || v === undefined ? null : v);

const stats = computed(() => [
  {
    label: 'Total Pengeluaran Bulan Ini',
    change: 'Bulan berjalan',
    value: formatRupiah(totals.value.spent ?? 0),
    icon: IconCard,
    delta: clean(mom.value.spent),
    deltaInvert: true,
  },
  {
    label: 'Gaji Utama',
    change: 'Dari gaji bulan ini',
    value: formatRupiah(budgetStore.summaryData?.salary ?? 0),
    icon: IconMoney,
    delta: clean(mom.value.limit),
  },
  {
    label: 'Sisa Gaji Pokok',
    change: 'Sampai akhir bulan',
    value: formatRupiah(totals.value.remaining ?? 0),
    icon: IconWallet,
    delta: clean(mom.value.remaining),
  },
  {
    label: 'Pemasukan Tambahan',
    change: 'Uang ekstra bulan ini',
    tooltip: 'Di luar gaji pokok. Opsional untuk dialokasikan ke kantong.',
    value: formatRupiah(totals.value.additionalIncome ?? 0),
    icon: IconAddCircle,
    delta: clean(mom.value.additionalIncome),
  },
]);

onMounted(() => {
  if (!hasBudgeting.value) return;
  budgetStore.fetchDashboardSummary();
});
</script>

<template>
  <div>
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-text-primary tracking-tight">Halo, {{ displayName }} 👋</h1>
          <PageGuide :steps="pageGuides.dashboard" />
        </div>
        <p class="text-sm text-text-muted mt-0.5">{{ todayLabel }}</p>
      </div>
      <div v-if="hasBudgeting" class="flex flex-wrap gap-2">
        <Button as="router-link" to="/app/budgeting">
          <IconMoney class="w-4 h-4" aria-hidden="true" />
          Kantong Keuangan
        </Button>
        <Button as="router-link" to="/app/history" variant="secondary">
          <IconChart class="w-4 h-4" aria-hidden="true" />
          Rekap Bulanan
        </Button>
      </div>
    </header>

    <div v-if="hasBudgeting" class="grid grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        v-for="s in stats"
        :key="s.label"
        :label="s.label"
        :value="s.value"
        :icon="s.icon"
        :delta="s.delta"
        :delta-invert="s.deltaInvert"
        :fallback="s.change"
        :hint="s.tooltip"
        :loading="loadingStats"
      />
    </div>

    <Card v-else>
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-lg bg-brand-surface flex items-center justify-center shrink-0">
          <IconAi class="w-6 h-6 text-brand-primary" aria-hidden="true" />
        </div>
        <div>
          <p class="font-semibold text-text-primary">Selamat datang di Kainest!</p>
          <p class="text-sm text-text-muted">
            Akun kamu masih dalam proses setup oleh admin. Fitur budgeting akan segera tersedia.
          </p>
        </div>
      </div>
    </Card>
  </div>
</template>
