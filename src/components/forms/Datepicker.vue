<script setup>
import { ref, watch, computed } from 'vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

const props = defineProps({
    modelValue: {
        type: Array,
        default: null,
    },
    align: {
        type: String,
        default: 'left',
    },
    placeholder: {
        type: String,
        default: 'Pilih rentang tanggal...',
    }
});

// Emit event untuk update v-model
const emit = defineEmits(['update:modelValue']);

const date = ref(props.modelValue);

// Computed property untuk menentukan apakah filter sedang aktif
// Filter dianggap aktif jika date.value tidak null dan memiliki panjang array > 0
const isFilterActive = computed(() => {
    return date.value !== null && date.value.length > 0;
});

// Konfigurasi Flatpickr
const config = ref({
    mode: 'range',
    static: true,
    monthSelectorType: 'static',
    dateFormat: 'Y-m-d', // Format standar backend
    altInput: true, // Tampilkan format yang lebih manusiawi di input
    altFormat: 'j M Y', // Contoh: 25 Nov 2025
    prevArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M5.4 10.8l1.4-1.4-4-4 4-4L5.4 0 0 5.4z" /></svg>',
    nextArrow: '<svg class="fill-current" width="7" height="11" viewBox="0 0 7 11"><path d="M1.4 10.8L0 9.4l4-4-4-4L1.4 0l5.4 5.4z" /></svg>',
    onReady: (selectedDates, dateStr, instance) => {
        instance.element.value = dateStr.replace('to', '-');
        const customClass = (props.align) ? props.align : '';
        instance.calendarContainer.classList.add(`flatpickr-${customClass}`);
    },
    // Saat user memilih tanggal, beritahu parent
    onChange: (selectedDates, dateStr) => {
        // Flatpickr range mode menghasilkan string "YYYY-MM-DD to YYYY-MM-DD"
        // Kita pecah menjadi array
        const dates = dateStr.split(' to ');
        // Hanya emit jika range sudah lengkap (start dan end)
        if (dates.length === 2) {
            emit('update:modelValue', dates);
        } else if (dates.length === 0 || dateStr === '') {
            // Handle clear
            emit('update:modelValue', null);
        }
    },
});

// Sinkronisasi jika parent mengubah nilai modelValue secara eksternal
watch(() => props.modelValue, (newValue) => {
    date.value = newValue;
});
</script>

<template>
    <div class="relative">
        <flat-pickr class="form-input pl-9 font-medium w-full sm:w-[15.5rem] transition-colors duration-200" :class="[
            isFilterActive
                ? 'bg-violet-50 text-violet-600 border-violet-300 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700/50' // Style saat AKTIF
                : 'bg-white dark:bg-gray-800 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 border-gray-200 dark:border-gray-700/60' // Style DEFAULT
        ]" :config="config" v-model="date" :placeholder="placeholder"></flat-pickr>

        <div class="absolute inset-0 right-auto flex items-center pointer-events-none pl-3">
            <svg class="fill-current transition-colors duration-200" :class="[
                isFilterActive ? 'text-violet-500 dark:text-violet-400' : 'text-gray-400 dark:text-gray-500'
            ]" width="16" height="16" viewBox="0 0 16 16">
                <path d="M5 4a1 1 0 0 0 0 2h6a1 1 0 1 0 0-2H5Z" />
                <path
                    d="M4 0a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4H4ZM2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z" />
            </svg>
        </div>
    </div>
</template>