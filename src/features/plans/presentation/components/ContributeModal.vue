<!-- ContributeModal.vue — setor atau tarik dari wishlist.
     Penarikan dicatat sebagai baris negatif, bukan dengan menghapus setoran lama,
     supaya riwayatnya tetap jujur. -->
<template>
  <Modal :open="open" :title="goal ? `Setor ke ${goal.name}` : 'Setor'" size="md"
    @update:open="$emit('close')">
    <div v-if="goal" class="space-y-4">
      <div class="rounded-md bg-surface-subtle border border-border-default p-4 flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="text-xs text-text-muted">Terkumpul</p>
          <p class="font-semibold text-text-primary tabular-nums">
            {{ formatRupiah(goal.collectedAmount) }} / {{ formatRupiah(goal.targetAmount) }}
          </p>
        </div>
        <p class="text-lg font-bold text-text-primary tabular-nums shrink-0">{{ goal.progressPercent }}%</p>
      </div>

      <Tabs v-model="mode" :items="opsiMode" />

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">
          {{ mode === 'tarik' ? 'Nominal ditarik' : 'Nominal disetor' }}
        </label>
        <CurrencyInput v-model="nominal" :min="0" />
        <p v-if="mode === 'tarik'" class="text-xs text-text-muted mt-1">
          Maksimal {{ formatRupiah(goal.collectedAmount) }}.
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1" for="contrib-note">Catatan</label>
        <Input id="contrib-note" v-model="catatan" placeholder="Opsional" />
      </div>

      <p class="text-xs text-text-muted">
        Setoran tabungan tidak dicatat sebagai pengeluaran — ia pemindahan uang,
        bukan konsumsi, jadi tidak muncul di grafik tren.
      </p>
    </div>

    <template #footer>
      <Button variant="secondary" @click="$emit('close')">Batal</Button>
      <Button variant="primary" :loading="submitting" @click="kirim">
        {{ mode === 'tarik' ? 'Tarik' : 'Setor' }}
      </Button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Modal, Button, Input, Tabs } from '@/ui';
import CurrencyInput from '@/components/forms/CurrencyInput.vue';
import { formatRupiah } from '@/utils/Utils';

const props = defineProps({
  open: { type: Boolean, default: false },
  goal: { type: Object, default: null },
  submitting: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'submit']);

const opsiMode = [
  { value: 'setor', label: 'Setor' },
  { value: 'tarik', label: 'Tarik' },
];
const mode = ref('setor');
const nominal = ref(0);
const catatan = ref('');

watch(
  () => props.open,
  (terbuka) => {
    if (!terbuka) return;
    mode.value = 'setor';
    nominal.value = 0;
    catatan.value = '';
  },
  { immediate: true }
);

function kirim() {
  const angka = mode.value === 'tarik' ? -Math.abs(nominal.value) : Math.abs(nominal.value);
  emit('submit', { amount: angka, note: catatan.value || null });
}
</script>
