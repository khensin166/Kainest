<script setup>
import { IconCalendar, IconChevronLeft, IconChevronRight } from '@/ui/icons';
import { computed, ref } from 'vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

// 1. Terima 'modelValue' dari parent (ini standar v-model Vue 3)
const props = defineProps({
  modelValue: {
    type: [Array, null],
    default: null,
  },
  placeholder: {
    type: String,
    default: 'Select dates...',
  },
  align: {
    type: String,
    default: '',
  }
});

// 2. Definisikan emit untuk mengirim update ke parent
const emit = defineEmits(['update:modelValue']);

// 3. Konfigurasi Flatpickr
// HAPUS 'defaultDate' dari sini. Biarkan parent yang menentukan nilai awalnya.
const config = ref({
  mode: 'range',
  static: true,
  monthSelectorType: 'static',
  dateFormat: 'Y-m-d', // Gunakan format yang ramah API (ISO format)
  altInput: true,      // Tampilkan format yang ramah user di input
  altFormat: 'M j, Y', // Format tampilan user (seperti 'Nov 28, 2025')
  prevArrow: '<IconChevronLeft class="fill-current" aria-hidden="true" />',
  nextArrow: '<IconChevronRight class="fill-current" aria-hidden="true" />',
  onReady: (selectedDates, dateStr, instance) => {
    // Hapus manipulasi DOM manual yang tidak perlu
    const customClass = (props.align) ? props.align : '';
    if (customClass) {
      instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
    }
  },
  // Hapus onChange manual. Biarkan v-model bekerja.
});

// 4. Computed Property sebagai Jembatan (PENTING)
// Ini menghubungkan prop 'modelValue' dari parent dengan v-model milik flatpickr
const dateValue = computed({
  get() {
    // Saat flatpickr butuh data, berikan dari prop parent
    return props.modelValue;
  },
  set(newValue) {
    // Saat flatpickr mengubah data, kirim event ke parent
    // Flatpickr kadang mengirim array kosong [] jika di-clear, ubah jadi null biar konsisten
    const valueToEmit = (newValue && newValue.length > 0) ? newValue : null;
    emit('update:modelValue', valueToEmit);
  }
});
</script>

<template>
  <div class="relative">
    <flat-pickr
      class="form-input pl-9 bg-surface-card text-text-primary hover:text-text-secondary font-medium w-[15.5rem]"
      :config="config" v-model="dateValue" :placeholder="placeholder"></flat-pickr>
    <div class="absolute inset-0 right-auto flex items-center pointer-events-none">
      <IconCalendar class="fill-current text-text-muted ml-3" aria-hidden="true" />
    </div>
  </div>
</template>