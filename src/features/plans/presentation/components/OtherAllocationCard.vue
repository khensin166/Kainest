<!-- OtherAllocationCard.vue — kartu "Alokasi Lain" di dalam grid Rincian Kantong.
     Berisi HANYA komitmen yang tidak punya kantong sendiri: alokasi wishlist
     (tidak punya kategori) dan tagihan yang kategorinya belum dibuatkan kantong.
     Tagihan yang kategorinya sudah punya kantong TIDAK ikut dijumlahkan di sini —
     uangnya sudah terwakili limit kantong itu, dan menghitungnya dua kali membuat
     total alokasi di layar melebihi gaji.

     Maknanya terbalik dari kantong biasa: kantong mengukur seberapa banyak sudah
     DIHABISKAN (penuh = bahaya), kartu ini mengukur seberapa banyak sudah
     DITUNAIKAN (penuh = bagus). Karena itu warnanya tidak pernah status-danger. -->
<template>
  <div v-if="adaIsi"
    class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-surface-card rounded-md border border-border-default">
    <header class="px-5 py-4 border-b border-border-muted flex items-center justify-between gap-2">
      <div class="flex items-center gap-2 min-w-0">
        <IconSavings class="h-5 w-5 shrink-0 text-text-muted" aria-hidden="true" />
        <h2 class="font-semibold text-text-primary truncate">Alokasi Lain</h2>
      </div>
      <router-link to="/app/plans"
        class="text-xs font-medium text-brand-text hover:underline shrink-0">
        Kelola
      </router-link>
    </header>

    <div class="p-5 space-y-4">
      <div>
        <p class="text-2xl font-bold text-text-primary tabular-nums">{{ formatRupiah(totalAlokasi) }}</p>
        <p class="text-xs text-text-muted mt-0.5">dialokasikan di luar kantong</p>
      </div>

      <div v-if="alokasiTabungan > 0">
        <div class="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div class="h-full rounded-full bg-brand-primary transition-[width] duration-500"
            :style="{ width: `${persenTersetor}%` }" />
        </div>
        <p class="mt-1.5 text-xs text-text-muted tabular-nums">{{ persenTersetor }}% tersetor bulan ini</p>
      </div>

      <div v-if="wishlist.length" class="space-y-2">
        <p class="text-xs font-medium text-text-muted">Wishlist</p>
        <div v-for="goal in wishlist" :key="goal.id" class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="text-sm text-text-primary truncate">
              <span v-if="goal.icon" aria-hidden="true">{{ goal.icon }}</span> {{ goal.name }}
            </p>
            <p class="text-xs text-text-muted tabular-nums">{{ goal.progressPercent }}% terkumpul</p>
          </div>
          <p class="text-sm text-text-secondary tabular-nums shrink-0">
            {{ formatRupiah(goal.monthlyAllocation) }}
          </p>
        </div>
      </div>

      <div v-if="tagihanTanpaKantong.length" class="space-y-2">
        <p class="text-xs font-medium text-text-muted">Tagihan tanpa kantong</p>
        <div v-for="bill in tagihanTanpaKantong" :key="bill.id" class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="text-sm text-text-primary truncate">{{ bill.name }}</p>
            <p class="text-xs text-text-muted">
              <template v-if="bill.installmentLabel">{{ bill.installmentLabel }} · </template>
              {{ bill.daysUntilDue >= 0 ? `${bill.daysUntilDue} hari lagi` : `lewat ${Math.abs(bill.daysUntilDue)} hari` }}
            </p>
          </div>
          <p class="text-sm text-text-secondary tabular-nums shrink-0">{{ formatRupiah(bill.amount) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { IconSavings } from '@/ui/icons';
import { formatRupiah } from '@/utils/Utils';

const props = defineProps({
  goals: { type: Array, default: () => [] },
  bills: { type: Array, default: () => [] },
  /** categoryId yang sudah punya kantong; tagihannya dikecualikan dari sini. */
  pocketCategoryIds: { type: Array, default: () => [] },
});

const wishlist = computed(() =>
  props.goals.filter((g) => g.status === 'ACTIVE' && g.monthlyAllocation > 0)
);

const tagihanTanpaKantong = computed(() =>
  props.bills.filter(
    (b) =>
      (b.cycleStatus === 'upcoming' || b.cycleStatus === 'overdue') &&
      !props.pocketCategoryIds.includes(b.categoryId)
  )
);

const alokasiTabungan = computed(() =>
  wishlist.value.reduce((t, g) => t + g.monthlyAllocation, 0)
);

const totalAlokasi = computed(
  () => alokasiTabungan.value + tagihanTanpaKantong.value.reduce((t, b) => t + b.amount, 0)
);

// Rata-rata progres wishlist, dibobot alokasi bulanan.
const persenTersetor = computed(() => {
  if (!wishlist.value.length || alokasiTabungan.value === 0) return 0;
  const berbobot = wishlist.value.reduce(
    (t, g) => t + g.progressPercent * g.monthlyAllocation,
    0
  );
  return Math.round(berbobot / alokasiTabungan.value);
});

const adaIsi = computed(() => wishlist.value.length > 0 || tagihanTanpaKantong.value.length > 0);
</script>
