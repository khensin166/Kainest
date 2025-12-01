<!-- TransactionItem.vue -->
<script setup>
import { computed } from 'vue';

// Menerima satu objek transaction entity
const props = defineProps({
  transaction: {
    type: Object,
    required: true,
  },
  // Prop untuk mengetahui apakah sedang proses hapus ID ini
  isDeleting: {
    type: Boolean,
    default: false
  }
});

// Definisi event yang bisa dikirim ke parent
const emit = defineEmits(['edit', 'delete']);

// Helper Formatter
const formattedAmount = computed(() => 
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(props.transaction.amount)
);

const formattedDate = computed(() => {
  if (!props.transaction.date) return '-';
  // Format tanggal menjadi: "25 Nov 2025"
  return props.transaction.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
});
</script>

<template>
  <div class="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700/60 p-4 transition-all hover:shadow-md">
    <div class="flex items-center justify-between">
      
      <div class="flex items-start overflow-hidden">
        <div class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-full p-3 sm:p-4 mr-4 text-2xl">
          {{ transaction.categoryIcon }}
        </div>
        <div class="truncate">
          <h4 class="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
            {{ transaction.categoryName }}
          </h4>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ formattedDate }}
          </p>
          <p v-if="transaction.note && transaction.note !== '-'" class="text-sm text-gray-500 dark:text-gray-400 italic mt-1 truncate">
            "{{ transaction.note }}"
          </p>
        </div>
      </div>

      <div class="flex flex-col items-end ml-4 flex-shrink-0">
        <span class="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mb-2">
          - {{ formattedAmount }}
        </span>
        
        <div class="flex space-x-2">
          <button 
            @click="emit('edit', transaction)"
            class="p-2 text-gray-500 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-gray-700 rounded-full transition-colors"
            title="Edit Transaksi"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </button>
          
          <button 
            @click="emit('delete', transaction.id)"
            class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded-full transition-colors relative"
            :disabled="isDeleting"
            title="Hapus Transaksi"
          >
             <span v-if="isDeleting" class="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-full">
               <svg class="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             </span>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 