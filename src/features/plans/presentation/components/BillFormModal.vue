<!-- BillFormModal.vue — buat/ubah tagihan & cicilan. -->
<template>
  <Modal :open="open" :title="bill ? 'Ubah Tagihan' : 'Tagihan Baru'" size="lg"
    @update:open="$emit('close')">
    <form class="space-y-4" @submit.prevent="simpan">
      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1" for="bill-name">Nama tagihan</label>
        <Input id="bill-name" v-model="form.name" placeholder="Kos, Listrik, Cicilan motor" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1" for="bill-amount">Nominal per pembayaran</label>
          <CurrencyInput id="bill-amount" v-model="form.amount" :min="0" />
          <p class="text-xs text-text-muted mt-1">Boleh dikoreksi saat menandai lunas.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">Kantong yang terpotong</label>
          <DropdownSelect wFull v-model="form.categoryId" :options="opsiKategori" placeholder="Pilih kategori" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1">Frekuensi</label>
          <DropdownSelect wFull v-model="form.frequency" :options="opsiFrekuensi" />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1" for="bill-dueday">Tanggal jatuh tempo</label>
          <input id="bill-dueday" v-model.number="form.dueDay" type="number" min="1" max="31"
            class="form-input w-full text-sm rounded-lg" placeholder="Contoh: 5" />
        </div>
      </div>

      <div v-if="form.frequency === 'YEARLY'">
        <label class="block text-sm font-medium text-text-secondary mb-1">Bulan jatuh tempo</label>
        <DropdownSelect wFull v-model="form.dueMonth" :options="opsiBulan" placeholder="Pilih bulan" />
      </div>

      <div v-if="form.frequency === 'MONTHLY'">
        <label class="block text-sm font-medium text-text-secondary mb-1" for="bill-tenor">
          Jumlah angsuran <span class="text-text-muted font-normal">(kosongkan bila berulang terus)</span>
        </label>
        <input id="bill-tenor" v-model.number="form.totalInstallments" type="number" min="1"
          class="form-input w-full text-sm rounded-lg" placeholder="Contoh: 12 untuk cicilan setahun" />
        <p class="text-xs text-text-muted mt-1">
          Cicilan berhenti menagih sendiri setelah angsuran terakhir lunas.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1" for="bill-remind">Ingatkan berapa hari sebelumnya</label>
          <input id="bill-remind" v-model.number="form.reminderDaysBefore" type="number" min="0" max="30"
            class="form-input w-full text-sm rounded-lg" />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1" for="bill-note">Catatan</label>
          <Input id="bill-note" v-model="form.note" placeholder="Opsional" />
        </div>
      </div>
    </form>

    <template #footer>
      <Button variant="secondary" @click="$emit('close')">Batal</Button>
      <Button variant="primary" :loading="submitting" @click="simpan">Simpan</Button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { Modal, Button, Input } from '@/ui';
import DropdownSelect from '@/components/forms/DropdownSelect.vue';
import CurrencyInput from '@/components/forms/CurrencyInput.vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  bill: { type: Object, default: null },
  categories: { type: Array, default: () => [] },
  submitting: { type: Boolean, default: false },
});
const emit = defineEmits(['close', 'submit']);

const kosong = () => ({
  name: '',
  amount: 0,
  categoryId: '',
  frequency: 'MONTHLY',
  dueDay: null,
  dueMonth: null,
  totalInstallments: null,
  reminderDaysBefore: 3,
  note: '',
});
const form = ref(kosong());

// Form dipakai ulang untuk buat dan ubah, jadi isinya harus ikut berubah saat
// tagihan yang diedit berganti — bukan hanya saat modal pertama kali dibuka.
watch(
  () => [props.open, props.bill],
  () => {
    if (!props.open) return;
    form.value = props.bill
      ? {
          name: props.bill.name,
          amount: props.bill.amount,
          categoryId: props.bill.categoryId,
          frequency: props.bill.frequency,
          dueDay: props.bill.dueDay,
          dueMonth: props.bill.dueMonth,
          totalInstallments: props.bill.totalInstallments,
          reminderDaysBefore: props.bill.reminderDaysBefore,
          note: props.bill.note ?? '',
        }
      : kosong();
  },
  { immediate: true }
);

const opsiKategori = computed(() =>
  props.categories.map((k) => ({ label: `${k.icon ?? ''} ${k.name}`.trim(), value: k.id }))
);

// WEEKLY tidak ditawarkan: satu siklus gajian memuat empat sampai lima jatuh
// tempo mingguan, sementara pelunasan hanya bisa dicatat sekali per siklus.
const opsiFrekuensi = [
  { label: 'Bulanan', value: 'MONTHLY' },
  { label: 'Tahunan', value: 'YEARLY' },
  { label: 'Sekali bayar', value: 'ONE_TIME' },
];

const opsiBulan = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
].map((nama, i) => ({ label: nama, value: i + 1 }));

function simpan() {
  emit('submit', { ...form.value });
}
</script>
