<script setup>
import { IconCalendar, IconChevronLeft, IconChevronRight } from '@/ui/icons';
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
    prevArrow: '<IconChevronLeft class="fill-current" aria-hidden="true" />',
    nextArrow: '<IconChevronRight class="fill-current" aria-hidden="true" />',
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
        <flat-pickr class="form-input pl-9 font-medium w-full transition-colors duration-200" :class="[ isFilterActive ? 'bg-brand-soft text-brand-primary border-brand-primary' : 'bg-surface-input text-text-secondary hover:text-text-primary border-border-default' ]" :config="config" v-model="date" :placeholder="placeholder"></flat-pickr>

        <div class="absolute inset-0 right-auto flex items-center pointer-events-none pl-3">
            <IconCalendar class="fill-current transition-colors duration-200" aria-hidden="true" />
        </div>
    </div>
</template>