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
                        placeholder="Contoh: 6000000" required :disabled="isSubmitting" />
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
                            :disabled="isSubmitting" />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <span class="text-gray-500 dark:text-gray-400">%</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-500 mt-1">
                        Persentase ini akan otomatis dibuatkan sebagai Kantong "Tabungan" yang bisa Anda edit kapan saja.
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
import { ref, defineEmits, defineProps, onMounted } from 'vue';
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
const savingPercentInput = ref(20); // Default 20%
const isSubmitting = ref(false);

onMounted(async () => {
    // Isi gaji dari store jika sudah ada
    if (budgetStore.salary && budgetStore.salary > 0) {
        salary.value = budgetStore.salary;
    }

    // Ambil list pocket jika belum ada untuk mengambil target tabungan
    if (!budgetStore.pocketsList || budgetStore.pocketsList.length === 0) {
        await budgetStore.fetchPockets();
    }

    if (budgetStore.pocketsList && budgetStore.pocketsList.length > 0) {
        const tabunganPocket = budgetStore.pocketsList.find(p => 
            p.category?.name?.toLowerCase().includes("tabungan") || 
            p.category?.name?.toLowerCase().includes("saving")
        );
        if (tabunganPocket && tabunganPocket.percentage != null) {
            savingPercentInput.value = tabunganPocket.percentage;
        }
    }
});

const handleSubmit = async () => {
    // Validasi sederhana
    if (!salary.value || savingPercentInput.value === '') {
        toast.warning('Mohon isi semua data yang diwajibkan.');
        return;
    }

    const payload = {
        salary: Number(salary.value),
        rent: 0,
        savingPercent: Number(savingPercentInput.value) / 100
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
