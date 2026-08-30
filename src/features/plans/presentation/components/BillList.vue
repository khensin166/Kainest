<!-- BillList.vue — daftar tagihan & cicilan pada siklus berjalan. -->
<template>
  <div class="space-y-3">
    <div v-if="loading" class="flex justify-center py-12">
      <Spinner class="h-6 w-6 text-brand-primary" />
    </div>

    <Card v-else-if="error" :padded="false">
      <div class="flex items-start gap-3 p-4">
        <IconWarning class="h-5 w-5 shrink-0 mt-0.5 text-status-danger" aria-hidden="true" />
        <div class="flex-1 min-w-0">
          <p class="font-semibold text-text-primary">Gagal memuat tagihan</p>
          <p class="text-sm text-text-muted mt-0.5">{{ error }}</p>
        </div>
        <Button variant="secondary" size="sm" class="shrink-0" @click="$emit('retry')">Coba Lagi</Button>
      </div>
    </Card>

    <EmptyState
      v-else-if="bills.length === 0"
      :icon="IconReceipt"
      title="Belum ada tagihan"
      description="Daftarkan kos, listrik, langganan, atau cicilan agar sistem bisa mengingatkanmu sebelum jatuh tempo."
    />

    <Card v-for="bill in bills" :key="bill.id" :padded="false">
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <span v-if="bill.categoryIcon" aria-hidden="true">{{ bill.categoryIcon }}</span>
              <h3 class="font-semibold text-text-primary truncate">{{ bill.name }}</h3>
              <Badge v-if="bill.installmentLabel" tone="neutral">
                {{ bill.installmentLabel }}
              </Badge>
              <Badge v-if="bill.status === 'COMPLETED'" tone="success">Lunas semua</Badge>
            </div>
            <p class="text-sm text-text-muted mt-0.5">
              {{ bill.categoryName || 'Tanpa kantong' }} · {{ labelJatuhTempo(bill) }}
            </p>
          </div>

          <div class="text-right shrink-0">
            <p class="font-bold text-text-primary tabular-nums">{{ formatRupiah(bill.amount) }}</p>
            <p v-if="bill.paidAmount && bill.paidAmount !== bill.amount"
              class="text-xs text-text-muted tabular-nums">
              dibayar {{ formatRupiah(bill.paidAmount) }}
            </p>
          </div>
        </div>

        <div class="mt-3 pt-3 border-t border-border-muted flex flex-wrap items-center justify-between gap-2">
          <span class="text-xs font-medium" :class="gayaStatus(bill).kelas">
            {{ gayaStatus(bill).label }}
          </span>

          <div class="flex flex-wrap gap-2">
            <template v-if="!bill.isSettled && bill.status === 'ACTIVE' && bill.dueDate">
              <Button variant="secondary" size="sm" @click="$emit('skip', bill)">Lewati</Button>
              <Button variant="primary" size="sm" @click="$emit('pay', bill)">Tandai Lunas</Button>
            </template>
            <Button v-else-if="bill.isSettled" variant="secondary" size="sm" @click="$emit('cancel', bill)">
              Batalkan
            </Button>
            <Button variant="secondary" size="sm" @click="$emit('edit', bill)">
              <IconEdit class="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="secondary" size="sm" @click="$emit('remove', bill)">
              <IconDelete class="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup>
import { Button, Card, Badge, Spinner, EmptyState } from '@/ui';
import { IconReceipt, IconWarning, IconEdit, IconDelete } from '@/ui/icons';
import { formatRupiah } from '@/utils/Utils';

defineProps({
  bills: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  error: { type: String, default: null },
});
defineEmits(['pay', 'skip', 'cancel', 'edit', 'remove', 'retry']);

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function labelJatuhTempo(bill) {
  if (!bill.dueDate) return `tanggal ${bill.dueDay}`;
  const d = new Date(bill.dueDate);
  return `jatuh tempo ${d.getDate()} ${BULAN[d.getMonth()]}`;
}

function gayaStatus(bill) {
  switch (bill.cycleStatus) {
    case 'paid':
      return { label: 'Sudah dibayar bulan ini', kelas: 'text-status-success-text' };
    case 'skipped':
      return { label: 'Dilewati bulan ini', kelas: 'text-text-muted' };
    case 'overdue':
      return { label: `Lewat ${Math.abs(bill.daysUntilDue)} hari`, kelas: 'text-status-danger-text' };
    case 'upcoming':
      return {
        label: bill.daysUntilDue === 0 ? 'Jatuh tempo hari ini' : `${bill.daysUntilDue} hari lagi`,
        kelas: bill.daysUntilDue <= 3 ? 'text-status-warning-text' : 'text-text-muted',
      };
    default:
      return { label: 'Tidak jatuh tempo siklus ini', kelas: 'text-text-faint' };
  }
}
</script>
