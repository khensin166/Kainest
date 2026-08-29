<template>
  <div class="currency-input-wrapper relative">
    <input
      ref="inputRef"
      type="text"
      inputmode="numeric"
      :value="displayValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :min="min"
      class="form-input w-full text-sm rounded-lg"
      v-bind="$attrs"
      @input="onInput"
      @keydown="onKeydown"
      @blur="onBlur"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { formatRupiahNoSymbol, parseRupiahToNumber } from '@/utils/Utils';

/**
 * CurrencyInput — Komponen terpusat untuk input mata uang Rupiah.
 * Tampilan akan otomatis diformat dengan titik pemisah ribuan (format ID).
 */

const props = defineProps({
  modelValue: {
    type: Number,
    default: null,
  },
  placeholder: {
    type: String,
    default: 'Contoh: 500.000',
  },
  min: {
    type: Number,
    default: 0,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);
const rawValue = ref('');

// Nilai yang ditampilkan di input: selalu dengan format titik ribuan
const displayValue = computed(() => {
  if (!rawValue.value && props.modelValue == null) return '';
  const num = props.modelValue ?? parseRupiahToNumber(rawValue.value);
  return num > 0 ? formatRupiahNoSymbol(num) : '';
});

// Sinkronisasi ketika v-model dari luar berubah
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal != null && newVal > 0) {
      rawValue.value = String(newVal);
    } else {
      rawValue.value = '';
    }
  },
  { immediate: true }
);

const onBlur = () => {
  const num = parseRupiahToNumber(rawValue.value);
  emit('update:modelValue', num > 0 ? num : null);
};

const onInput = (e) => {
  // Hanya boleh angka
  const cleaned = e.target.value.replace(/[^0-9]/g, '');
  rawValue.value = cleaned;

  const num = parseInt(cleaned, 10);
  // Emit angka murni ke induk agar v-model selalu update
  emit('update:modelValue', isNaN(num) ? null : num);

  // Force update value di DOM agar kursor tidak kacau jika titik ditambahkan/dihapus
  if (inputRef.value) {
    inputRef.value.value = cleaned ? formatRupiahNoSymbol(num) : '';
  }
};

const onKeydown = (e) => {
  // Izinkan tombol navigasi dan action
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
  if (
    allowedKeys.includes(e.key) ||
    (e.ctrlKey || e.metaKey)
  ) return;

  // Blokir karakter non-angka
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault();
  }
};
</script>

<style scoped>
.currency-input-wrapper {
  position: relative;
}
</style>
