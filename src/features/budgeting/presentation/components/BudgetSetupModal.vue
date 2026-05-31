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
                        Pemasukan / Gaji Bulanan (Rp) <span class="text-red-500">*</span>
                    </label>
                    <input v-model="salary" type="number"
                        class="form-input w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-violet-500 focus:ring-violet-500"
                        placeholder="Contoh: 6000000" required :disabled="budgetStore.isLoadingSummary" />
                </div>

            </div>

            <div class="mt-6 flex justify-end gap-3">
                <button v-if="!forced" type="button"
                    class="btn-sm border-gray-200 hover:border-gray-300 text-gray-600 dark:text-gray-300 dark:border-gray-600 dark:hover:border-gray-500"
                    @click="$emit('close')" :disabled="budgetStore.isLoadingSummary">
                    Batal
                </button>
                <button type="submit" class="btn-sm bg-violet-500 hover:bg-violet-600 text-white"
                    :disabled="budgetStore.isLoadingSummary">
                    <span v-if="budgetStore.isLoadingSummary">Menyimpan...</span>
                    <span v-else>Simpan Perubahan</span>
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { toast } from 'vue3-toastify';

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

const handleSubmit = async () => {
    // Validasi sederhana
    if (!salary.value) {
        toast.warning('Mohon isi pemasukan / gaji Anda.');
        return;
    }

    // Karena user ingin kos dan tabungan diatur di kantong saja,
    // kita set default rent = 0 dan saving = 0 untuk melewati validasi awal backend.
    const payload = {
        salary: Number(salary.value),
        rent: 0,
        savingPercent: 0
    };

    const result = await budgetStore.setupBudget(payload);

    if (result.success) {
        toast.success('Konfigurasi budget berhasil disimpan!');
        emit('close');
    } else {
        toast.error(result.message || 'Gagal menyimpan konfigurasi.');
    }
};
</script>
