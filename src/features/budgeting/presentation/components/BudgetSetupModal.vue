<template>
    <div class="px-5 py-4">
        <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Atur konfigurasi keuangan bulanan Anda di sini.
        </div>

        <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
                <!-- Input Gaji -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Pemasukan / Gaji Bulanan <span class="text-red-500">*</span>
                    </label>
                    <div class="relative rounded-md shadow-sm">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span class="text-gray-500 sm:text-sm">Rp</span>
                        </div>
                        <input v-model="displaySalary" type="text"
                            class="form-input w-full rounded-md border-gray-300 dark:border-gray-600 pl-10 dark:bg-gray-700 dark:text-gray-100 focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                            placeholder="Contoh: 6.000.000" required :disabled="isSubmitting"
                            @input="onSalaryInput" />
                    </div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Gaji ini akan menjadi acuan 100% saat Anda mengatur persentase pembagian di <strong class="text-violet-600 dark:text-violet-400">Kelola Kantong</strong> nanti.
                    </p>
                </div>

                <!-- Dropdown Tanggal Gajian / Reset Siklus -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Tanggal Gajian / Reset Siklus Bulanan
                    </label>
                    <select v-model="payday"
                        class="form-select w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                        :disabled="isSubmitting">
                        <option v-for="day in paydayOptions" :key="day.value" :value="day.value">
                            {{ day.label }}
                        </option>
                    </select>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Bot Kainest akan mengirimkan laporan &amp; mereset siklus keuangan pada tanggal ini setiap bulannya.
                    </p>
                </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
                <button v-if="!forced" type="button"
                    class="btn-sm border-gray-200 hover:border-gray-300 text-gray-600 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                    @click="$emit('close')" :disabled="isSubmitting">
                    Batal
                </button>
                <button type="submit" class="btn-sm bg-violet-500 hover:bg-violet-600 text-white"
                    :disabled="isSubmitting">
                    <span v-if="isSubmitting">Menyimpan...</span>
                    <span v-else>Simpan Perubahan</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps, onMounted, nextTick, watch } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { toast } from 'vue3-toastify';
import { formatRupiahNoSymbol } from '@/utils/Utils';

const props = defineProps({
    forced: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['close']);
const budgetStore = useBudgetStore();

// State lokal form
const salary = ref('');
const displaySalary = ref('');
const payday = ref(31); // Default: Akhir Bulan
const isSubmitting = ref(false);

// Opsi dropdown tanggal gajian (1 - 31)
const paydayOptions = computed(() => {
    const options = [];
    for (let i = 1; i <= 30; i++) {
        options.push({ value: i, label: `Tanggal ${i}` });
    }
    options.push({ value: 31, label: '31 / Akhir Bulan (Default)' });
    return options;
});

watch(() => budgetStore.salary, (newVal) => {
    if (newVal && newVal > 0 && !salary.value) { // only sync if local is empty to prevent overriding user input
        salary.value = newVal;
        displaySalary.value = formatRupiahNoSymbol(newVal);
    }
}, { immediate: true });

watch(() => budgetStore.payday, (newVal) => {
    if (newVal) {
        payday.value = Number(newVal);
    }
}, { immediate: true });

const onSalaryInput = (e) => {
    const input = e.target;
    const selectionStart = input.selectionStart;
    const oldLength = input.value.length;

    // Bersihkan semua karakter non-digit
    const raw = input.value.replace(/\D/g, '');
    
    if (raw) {
        salary.value = Number(raw);
        displaySalary.value = formatRupiahNoSymbol(raw);
    } else {
        salary.value = '';
        displaySalary.value = '';
    }

    // Sesuaikan cursor setelah rendering selesai
    nextTick(() => {
        const newLength = displaySalary.value.length;
        const newPosition = selectionStart + (newLength - oldLength);
        input.setSelectionRange(newPosition, newPosition);
    });
};

const handleSubmit = async () => {
    // Validasi sederhana
    if (!salary.value) {
        toast.warning('Mohon isi pemasukan / gaji bulanan Anda.');
        return;
    }

    const payload = {
        salary: Number(salary.value),
        rent: 0,
        payday: payday.value,
    };

    isSubmitting.value = true;
    const result = await budgetStore.setupBudget(payload);
    isSubmitting.value = false;

    if (result.success) {
        toast.success('Konfigurasi budget berhasil disimpan!');
        emit('close', { refresh: true });
    } else {
        toast.error(result.message || 'Gagal menyimpan konfigurasi.');
    }
};
</script>
