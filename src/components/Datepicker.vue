<script setup>
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
  prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
  nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
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
      class="form-input pl-9 dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 font-medium w-[15.5rem]"
      :config="config" v-model="dateValue" :placeholder="placeholder"></flat-pickr>
    <div class="absolute inset-0 right-auto flex items-center pointer-events-none">
      <svg class="fill-current text-gray-400 dark:text-gray-500 ml-3" width="16" height="16" viewBox="0 0 16 16">
        <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
        <path
          d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
      </svg>
    </div>
  </div>
</template>