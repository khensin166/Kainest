<!-- SavingGoalFormModal.vue — buat/ubah wishlist tabungan. -->
<template>
  <Modal :open="open" :title="goal ? 'Ubah Wishlist' : 'Wishlist Baru'" size="md"
    @update:open="$emit('close')">
    <form class="space-y-4" @submit.prevent="$emit('submit', { ...form })">
      <div class="grid grid-cols-[5rem_1fr] gap-3">
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1" for="goal-icon">Ikon</label>
          <Input id="goal-icon" v-model="form.icon" placeholder="🏝️" maxlength="4" />
        </div>
        <div>
          <label class="block text-sm font-medium text-text-secondary mb-1" for="goal-name">Nama</label>
          <Input id="goal-name" v-model="form.name" placeholder="Jalan ke Bali" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">Target</label>
        <CurrencyInput v-model="form.targetAmount" :min="0" />
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1">Sisihkan per bulan</label>
        <CurrencyInput v-model="form.monthlyAllocation" :min="0" />
        <p class="text-xs text-text-muted mt-1">
          Nominal ini langsung memotong budget siklus berjalan, sama seperti kantong.
          Kosongkan bila hanya ingin mencatat keinginan tanpa memotong budget.
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-text-secondary mb-1" for="goal-date">
          Tenggat <span class="text-text-muted font-normal">(opsional)</span>
        </label>
        <input id="goal-date" v-model="form.targetDate" type="date" class="form-input w-full text-sm rounded-lg" />
      </div>
    </form>

    <template #footer>
      <Button variant="secondary" @click="$emit('close')">Batal</Button>
      <Button variant="primary" :loading="submitting" @click="$emit('submit', { ...form })">Simpan</Button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { Modal, Button, Input } from '@/ui';
import CurrencyInput from '@/components/forms/CurrencyInput.vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  goal: { type: Object, default: null },
  submitting: { type: Boolean, default: false },
});
defineEmits(['close', 'submit']);

const kosong = () => ({
  name: '', icon: '', targetAmount: 0, monthlyAllocation: 0, targetDate: '',
});
const form = ref(kosong());

watch(
  () => [props.open, props.goal],
  () => {
    if (!props.open) return;
    form.value = props.goal
      ? {
          name: props.goal.name,
          icon: props.goal.icon ?? '',
          targetAmount: props.goal.targetAmount,
          monthlyAllocation: props.goal.monthlyAllocation,
          targetDate: props.goal.targetDate
            ? new Date(props.goal.targetDate).toISOString().slice(0, 10)
            : '',
        }
      : kosong();
  },
  { immediate: true }
);
</script>
