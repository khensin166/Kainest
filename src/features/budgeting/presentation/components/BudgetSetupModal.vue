<template>
        <div class="px-5 py-4">
        <div class="text-sm font-medium text-text-muted mb-4">
            Atur konfigurasi keuangan bulanan Anda di sini.
        </div>

        <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
                <!-- Input Gaji -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-text-secondary">
                        Pemasukan / Gaji Bulanan <span class="text-status-danger">*</span>
                    </label>
                    <CurrencyInput
                        v-model="salary"
                        placeholder="Contoh: 6.000.000"
                        :required="true"
                        :disabled="isSubmitting"
                    />
                    <p class="text-xs text-text-muted mt-2">
                        Gaji ini akan menjadi acuan 100% saat Anda mengatur persentase pembagian di <strong class="text-brand-text">Kelola Kantong</strong> nanti.
                    </p>
                </div>

                <!-- Dropdown Tanggal Gajian / Reset Siklus -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-text-secondary">
                        Tanggal Gajian / Reset Siklus Bulanan
                    </label>
                    <select v-model="payday"
                        class="form-select w-full rounded-md border-border-default bg-surface-input text-text-primary focus:border-brand-primary focus:ring-brand-primary sm:text-sm"
                        :disabled="isSubmitting">
                        <option v-for="day in paydayOptions" :key="day.value" :value="day.value">
                            {{ day.label }}
                        </option>
                    </select>
                    <p class="text-xs text-text-muted mt-2">
                        Bot Kainest akan mengirimkan laporan &amp; mereset siklus keuangan pada tanggal ini setiap bulannya.
                    </p>
                </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
                <button v-if="!forced" type="button"
                    class="btn-sm border-border-default hover:border-border-strong text-text-secondary"
                    @click="$emit('close')" :disabled="isSubmitting">
                    Batal
                </button>
                <button type="submit" class="btn-sm bg-brand-primary hover:bg-brand-primary-hover text-text-inverse"
                    :disabled="isSubmitting">
                    <span v-if="isSubmitting">Menyimpan...</span>
                    <span v-else>Simpan Perubahan</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps, watch } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { toast } from 'vue3-toastify';
import CurrencyInput from '@/components/forms/CurrencyInput.vue';

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
    if (newVal && newVal > 0 && !salary.value) {
        salary.value = newVal;
        // CurrencyInput mengelola displaynya sendiri via v-model
    }
}, { immediate: true });

watch(() => budgetStore.payday, (newVal) => {
    if (newVal) {
        payday.value = Number(newVal);
    }
}, { immediate: true });

// onSalaryInput tidak lagi diperlukan karena CurrencyInput mengelolanya sendiri


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
