<!-- DashboardUpcomingBills.vue — tagihan terdekat di Dashboard utama.
     HANYA tagihan, tanpa wishlist. Tagihan punya tenggat dan melewatkannya ada
     akibatnya; wishlist tidak mendesak. Mencampurnya membuat kartu ini berhenti
     berarti "ada yang perlu ditindak". -->
<template>
  <div class="col-span-full bg-surface-card rounded-md border"
    :class="store.health?.isDanger ? 'border-status-danger/40' : 'border-border-default'">
    <header class="px-5 py-4 border-b border-border-muted flex items-center justify-between gap-2">
      <h2 class="font-semibold text-text-primary">Tagihan Mendatang</h2>
      <router-link to="/app/plans" class="text-xs font-medium text-brand-text hover:underline">
        Lihat semua
      </router-link>
    </header>

    <div class="p-5">
      <div v-if="store.isLoadingBills" class="flex justify-center py-6">
        <Spinner class="h-5 w-5 text-brand-primary" />
      </div>

      <p v-else-if="tigaTerdekat.length === 0" class="text-sm text-text-muted">
        Tidak ada tagihan yang perlu dibayar dalam waktu dekat.
      </p>

      <ul v-else class="space-y-3">
        <li v-for="bill in tigaTerdekat" :key="bill.id" class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-medium text-text-primary truncate">
              <span v-if="bill.categoryIcon" aria-hidden="true">{{ bill.categoryIcon }}</span>
              {{ bill.name }}
              <span v-if="bill.installmentLabel" class="text-text-muted font-normal">
                ({{ bill.installmentLabel }})
              </span>
            </p>
            <p class="text-xs" :class="kelasTenggat(bill)">{{ labelTenggat(bill) }}</p>
          </div>
          <p class="text-sm font-semibold text-text-primary tabular-nums shrink-0">
            {{ formatRupiah(bill.amount) }}
          </p>
        </li>
      </ul>

      <p v-if="store.health?.isDanger" class="mt-4 pt-3 border-t border-border-muted text-xs text-status-danger-text">
        Sisa uangmu kurang {{ formatRupiah(store.health.shortfall) }} untuk menutup tagihan bulan ini.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Spinner } from '@/ui';
import { usePlansStore } from '@/features/plans/presentation/stores/usePlansStore';
import { formatRupiah } from '@/utils/Utils';

const store = usePlansStore();

onMounted(() => {
  if (store.bills.length === 0) store.fetchBills();
  if (!store.health) store.fetchHealth();
});

const tigaTerdekat = computed(() =>
  store.openBills.slice().sort((a, b) => (a.daysUntilDue ?? 0) - (b.daysUntilDue ?? 0)).slice(0, 3)
);

function labelTenggat(bill) {
  if (bill.daysUntilDue == null) return '';
  if (bill.daysUntilDue < 0) return `Lewat ${Math.abs(bill.daysUntilDue)} hari`;
  if (bill.daysUntilDue === 0) return 'Jatuh tempo hari ini';
  return `${bill.daysUntilDue} hari lagi`;
}

function kelasTenggat(bill) {
  if (bill.daysUntilDue == null) return 'text-text-muted';
  if (bill.daysUntilDue < 0) return 'text-status-danger-text';
  if (bill.daysUntilDue <= 3) return 'text-status-warning-text';
  return 'text-text-muted';
}
</script>
