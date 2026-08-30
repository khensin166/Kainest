<!-- SavingGoalCard.vue — satu wishlist tabungan.
     Progress bar di sini bermakna TERBALIK dari kartu kantong: penuh berarti
     bagus, bukan bahaya. Karena itu warnanya tidak pernah mengikuti status-danger
     saat mendekati penuh. -->
<template>
  <Card :padded="false">
    <div class="p-4">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <div class="flex items-center gap-2 flex-wrap">
            <span v-if="goal.icon" aria-hidden="true">{{ goal.icon }}</span>
            <h3 class="font-semibold text-text-primary truncate">{{ goal.name }}</h3>
            <Badge v-if="goal.isAchieved" tone="success">Tercapai</Badge>
            <Badge v-else-if="goal.behindTarget" tone="warning">Di belakang tenggat</Badge>
          </div>
          <p class="text-sm text-text-muted mt-0.5">
            Target {{ formatRupiah(goal.targetAmount) }}
            <template v-if="goal.monthlyAllocation > 0">
              · {{ formatRupiah(goal.monthlyAllocation) }}/bulan
            </template>
          </p>
        </div>

        <div class="text-right shrink-0">
          <p class="text-lg font-bold text-text-primary tabular-nums">{{ goal.progressPercent }}%</p>
        </div>
      </div>

      <div class="mt-3">
        <div class="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
          <div class="h-full rounded-full transition-[width] duration-500"
            :class="goal.isAchieved ? 'bg-status-success' : 'bg-brand-primary'"
            :style="{ width: `${Math.min(100, goal.progressPercent)}%` }" />
        </div>
        <div class="mt-1.5 flex items-center justify-between text-xs text-text-muted tabular-nums">
          <span>{{ formatRupiah(goal.collectedAmount) }} terkumpul</span>
          <span v-if="goal.remainingAmount > 0">kurang {{ formatRupiah(goal.remainingAmount) }}</span>
        </div>
      </div>

      <p v-if="perkiraan" class="mt-2 text-xs text-text-muted">{{ perkiraan }}</p>

      <div class="mt-3 pt-3 border-t border-border-muted flex flex-wrap gap-2 justify-end">
        <Button variant="secondary" size="sm" @click="$emit('edit', goal)">
          <IconEdit class="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="secondary" size="sm" @click="$emit('remove', goal)">
          <IconDelete class="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button variant="primary" size="sm" @click="$emit('contribute', goal)">Setor</Button>
      </div>
    </div>
  </Card>
</template>

<script setup>
import { computed } from 'vue';
import { Card, Button, Badge } from '@/ui';
import { IconEdit, IconDelete } from '@/ui/icons';
import { formatRupiah } from '@/utils/Utils';

const props = defineProps({ goal: { type: Object, required: true } });
defineEmits(['edit', 'remove', 'contribute']);

const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

const perkiraan = computed(() => {
  const g = props.goal;
  if (g.isAchieved || !g.estimatedFinish || !g.monthsToFinish) return null;
  const d = new Date(g.estimatedFinish);
  return `Perkiraan selesai ${BULAN[d.getMonth()]} ${d.getFullYear()} (${g.monthsToFinish} bulan lagi)`;
});
</script>
