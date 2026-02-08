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

                <!-- Input Sewa/Kos -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Biaya Sewa / Kos (Rp) <span class="text-red-500">*</span>
                    </label>
                    <input v-model="rent" type="number"
                        class="form-input w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-violet-500 focus:ring-violet-500"
                        placeholder="Contoh: 1500000" required :disabled="budgetStore.isLoadingSummary" />
                </div>

                <!-- Input Saving Percent -->
                <div>
                    <label class="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        Target Tabungan (%) <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <input v-model="savingPercentInput" type="number"
                            class="form-input w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:border-violet-500 focus:ring-violet-500 pr-8"
                            placeholder="Contoh: 20" required min="0" max="100"
                            :disabled="budgetStore.isLoadingSummary" />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span class="text-gray-500 dark:text-gray-400">%</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                        Persentase dari gaji yang ingin dialokasikan untuk tabungan.
                    </p>
                </div>
            </div>

            <div class="mt-6 flex justify-end gap-3">
                <button type="button"
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
import { ref, defineEmits } from 'vue';
import { useBudgetStore } from '../stores/useBudgetStore';
import { toast } from 'vue3-toastify';

const emit = defineEmits(['close']);
const budgetStore = useBudgetStore();

// State lokal form
const salary = ref('');
const rent = ref('');
const savingPercentInput = ref(20); // Default 20%

const handleSubmit = async () => {
    // Validasi sederhana
    if (!salary.value || !rent.value || savingPercentInput.value === '') {
        toast.warning('Mohon lengkapi semua field wajib.');
        return;
    }

    // Konversi savingPercentInput (0-100) ke desimal (0-1) untuk backend jika diperlukan,
    // namum request body yang diminta user adalah integer untuk salary/rent,
    // dan savingPercent biasanya decimal (0.2) atau integer (20). 
    // Berdasarkan request user: "savingPercent": 0.2

    // Mari kita asumsikan input user "20" berarti 20%, jadi kita bagi 100.
    const payload = {
        salary: Number(salary.value),
        rent: Number(rent.value),
        savingPercent: Number(savingPercentInput.value) / 100
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
