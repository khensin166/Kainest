<!-- TransactionItem.vue -->
<script setup>
import { Spinner } from '@/ui';
import { IconDelete, IconEdit } from '@/ui/icons';
import { computed } from 'vue';
import { formatRupiah } from '@/utils/Utils';

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

// Helper untuk prefix tanda dan warna berdasarkan tipe transaksi
const amountPrefix = computed(() => {
  const type = props.transaction.type || props.transaction.category?.type;
  return type === 'INCOME' ? '+' : '-';
});
const amountColorClass = computed(() => {
  const type = props.transaction.type || props.transaction.category?.type;
  return type === 'INCOME' ? 'text-status-success' : 'text-status-danger';
});


const formattedDate = computed(() => {
  if (!props.transaction.date) return '-';
  // Format tanggal menjadi: "25 Nov 2025"
  return props.transaction.date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
});
</script>

<template>
  <div class="bg-surface-card rounded-md border border-border-default p-4 transition-all">
    <div class="flex items-center justify-between">
      
      <div class="flex items-start overflow-hidden">
        <div class="flex-shrink-0 bg-surface-subtle rounded-full p-3 sm:p-4 mr-4 text-2xl">
          {{ transaction.categoryIcon }}
        </div>
        <div class="truncate">
          <h4 class="text-base font-semibold text-text-primary truncate">
            {{ transaction.categoryName }}
          </h4>
          <p class="text-sm text-text-muted">
            {{ formattedDate }}
          </p>
          <p v-if="transaction.note && transaction.note !== '-'" class="text-sm text-text-muted mt-1 truncate">
            "{{ transaction.note }}"
          </p>
        </div>
      </div>

      <div class="flex flex-col items-end ml-4 flex-shrink-0">
        <span class="text-base sm:text-lg font-bold mb-2" :class="amountColorClass">
          {{ amountPrefix }} {{ formatRupiah(transaction.amount) }}
        </span>

        
        <div class="flex space-x-2">
          <button 
            @click="emit('edit', transaction)"
            class="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-soft rounded-full transition-colors"
            title="Edit Transaksi"
          >
            <IconEdit class="w-5 h-5" aria-hidden="true" />
          </button>
          
          <button 
            @click="emit('delete', transaction.id)"
            class="p-2 text-text-muted hover:text-status-danger hover:bg-status-danger-bg rounded-full transition-colors relative"
            :disabled="isDeleting"
            title="Hapus Transaksi"
          >
             <span v-if="isDeleting" class="absolute inset-0 flex items-center justify-center bg-surface-card/70 rounded-full">
               <Spinner class="h-5 w-5 text-status-danger" />
             </span>
            <IconDelete class="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 