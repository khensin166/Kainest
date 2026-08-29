<!-- BudgetHeroCard.vue -->
<script setup>
import { IconChevronDown, IconTrendDown, IconTrendUp, IconWarning } from '@/ui/icons';
import { ref } from 'vue';
import { formatRupiah as formatCurrency } from '@/utils/Utils';

const props = defineProps({
  totalRemaining: {
    type: Number,
    required: true,
  },
  totalSalary: {
    type: Number,
    default: 0,
  },
  totalIncome: {
    type: Number,
    default: 0,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  momSalary: {
    type: Number,
    default: null,
  },
  momIncome: {
    type: Number,
    default: null,
  },
  momSpent: {
    type: Number,
    default: null,
  },
  momRemaining: {
    type: Number,
    default: null,
  },
  unallocated: {
    type: Number,
    default: 0,
  },
  monthName: {
    type: String,
    default: 'Bulan Ini',
  },
  trendData: {
    type: Object,
    default: null,
  }
});

import { Card, Badge } from '@/ui';

/** Delta 0 bukan informasi — badge disembunyikan, bukan menampilkan "0% vs bulan lalu". */
const showDelta = (v) => v !== null && v !== undefined && v !== 0;

// Mobile expand/collapse state for secondary stats
const isDetailsExpanded = ref(false);
</script>

<template>
  <Card :padded="false" class="flex flex-col col-span-full sm:col-span-6 xl:col-span-4">
    <div class="p-5 flex flex-col h-full">

      <header class="flex items-baseline justify-between gap-3 mb-6">
        <h2 class="text-sm font-semibold text-text-primary">Ringkasan Keuangan</h2>
        <span class="text-xs font-mono text-text-muted">Periode: {{ monthName }}</span>
      </header>

      <!-- Angka utama. Satu tingkat, tanpa kotak di dalam kotak. -->
      <p class="text-xs text-text-muted mb-1.5">Sisa Gaji Pokok</p>
      <p class="text-4xl font-bold text-text-primary tabular-nums tracking-tight leading-none">
        {{ formatCurrency(totalRemaining) }}
      </p>

      <div v-if="showDelta(momRemaining) || unallocated > 0" class="flex flex-wrap items-center gap-2 mt-3">
        <Badge v-if="showDelta(momRemaining)" :tone="momRemaining >= 0 ? 'success' : 'danger'">
          <component :is="momRemaining >= 0 ? IconTrendUp : IconTrendDown" class="w-3 h-3" aria-hidden="true" />
          {{ Math.abs(momRemaining) }}% vs bulan lalu
        </Badge>
        <Badge v-if="unallocated > 0" tone="warning">
          <IconWarning class="w-3 h-3" aria-hidden="true" />
          {{ formatCurrency(unallocated) }} belum dialokasikan
        </Badge>
      </div>

      <!-- Rincian. Dipisah garis, bukan ditumpuk sebagai kartu bersarang. -->
      <div class="mt-6 pt-5 border-t border-border-default space-y-4">

        <div class="flex items-baseline justify-between gap-3">
          <span class="text-xs text-text-muted">Pengeluaran Bulan Ini</span>
          <span class="flex items-baseline gap-2">
            <span class="text-sm font-semibold text-text-primary tabular-nums">{{ formatCurrency(totalSpent) }}</span>
            <Badge v-if="showDelta(momSpent)" :tone="momSpent <= 0 ? 'success' : 'danger'">
              {{ momSpent > 0 ? '+' : '' }}{{ momSpent }}%
            </Badge>
          </span>
        </div>

        <div :class="isDetailsExpanded ? 'block space-y-4' : 'hidden sm:block sm:space-y-4'">
          <div class="flex items-baseline justify-between gap-3">
            <span class="text-xs text-text-muted">Gaji Utama</span>
            <span class="flex items-baseline gap-2">
              <span class="text-sm font-semibold text-text-primary tabular-nums">{{ formatCurrency(totalSalary) }}</span>
              <Badge v-if="showDelta(momSalary)" :tone="momSalary >= 0 ? 'success' : 'danger'">
                {{ momSalary > 0 ? '+' : '' }}{{ momSalary }}%
              </Badge>
            </span>
          </div>

          <div class="flex items-baseline justify-between gap-3">
            <span class="text-xs text-text-muted">Tambahan</span>
            <span class="flex items-baseline gap-2">
              <span class="text-sm font-semibold text-text-primary tabular-nums">{{ formatCurrency(totalIncome) }}</span>
              <Badge v-if="showDelta(momIncome)" :tone="momIncome >= 0 ? 'success' : 'danger'">
                {{ momIncome > 0 ? '+' : '' }}{{ momIncome }}%
              </Badge>
            </span>
          </div>
        </div>

        <!-- Perilaku mobile tidak berubah: rincian gaji disembunyikan sampai dibuka. -->
        <button
          type="button"
          @click="isDetailsExpanded = !isDetailsExpanded"
          class="sm:hidden flex items-center justify-center gap-1.5 w-full pt-1 text-xs font-medium text-text-muted hover:text-text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm"
        >
          {{ isDetailsExpanded ? 'Sembunyikan rincian' : 'Lihat rincian gaji' }}
          <IconChevronDown class="w-3.5 h-3.5 transition-transform" :class="isDetailsExpanded ? 'rotate-180' : ''" aria-hidden="true" />
        </button>
      </div>

    </div>
  </Card>
</template>