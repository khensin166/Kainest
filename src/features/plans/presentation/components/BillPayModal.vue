<!-- BillPayModal.vue — konfirmasi pelunasan, dengan koreksi nominal. -->
<template>
  <Modal :open="open" title="Tandai Lunas" size="md" @update:open="$emit('close')">
    <div v-if="bill" class="space-y-4">
      <div class="rounded-md bg-surface-subtle border border-border-default p-4">
        <p class="font-semibold text-text-primary">{{ bill.name }}</p>
        <p class="text-sm text-text-muted mt-0.5">
          {{ bill.categoryName || 'Tanpa kantong' }}
          <template v-if="bill.installmentLabel">
            · angsuran {{ bill.paidInstallments + 1 }}/{{ bill.totalInstallments }}
          </template>
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">Nominal yang dibayar</label>
        <CurrencyInput v-model="nominal" :min="0" />
        <p class="text-xs text-text-muted mt-1">
          Perkiraan {{ formatRupiah(bill.amount) }}. Kalau tagihan aslinya berbeda, isi
          angka sebenarnya — perkiraan di tagihan tidak ikut berubah.
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1" for="pay-date">Tanggal bayar</label>
        <input id="pay-date" v-model="tanggal" type="date" class="form-input w-full text-sm rounded-lg" />
      </div>

      <p class="text-xs text-text-muted">
        Pelunasan dicatat sebagai pengeluaran dan memotong kantong
        <span class="font-medium text-text-secondary">{{ bill.categoryName || 'terkait' }}</span>.
      </p>
    </div>

    <template #footer>
      <Button variant="secondary" @click="$emit('close')">Batal</Button>
      <Button variant="primary" :loading="submitting" @click="$emit('submit', { amount: nominal, date: tanggal })">
        Tandai Lunas
      </Button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Modal, Button } from '@/ui';
import CurrencyInput from '@/components/forms/CurrencyInput.vue';
import { formatRupiah } from '@/utils/Utils';

const props = defineProps({
  open: { type: Boolean, default: false },
  bill: { type: Object, default: null },
  submitting: { type: Boolean, default: false },
});
defineEmits(['close', 'submit']);

const nominal = ref(0);
const tanggal = ref('');

watch(
  () => [props.open, props.bill],
  () => {
    if (!props.open || !props.bill) return;
    nominal.value = props.bill.amount;
    tanggal.value = new Date().toISOString().slice(0, 10);
  },
  { immediate: true }
);
</script>
