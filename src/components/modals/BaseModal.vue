<!-- BaseModal.vue -->
<script setup>
import { computed } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

// Kita simpan defineProps ke variabel 'props' agar bisa diakses di dalam computed
const props = defineProps({
  isOpen: { type: Boolean, required: true },
  loading: { type: Boolean, default: false },
  hideFooter: { type: Boolean, default: false },
  // Prop untuk mengontrol ukuran modal
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].includes(value)
  },
  preventClose: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["close", "confirm"]);

// Fungsi ini hanya dipanggil oleh Headless UI saat klik luar/ESC
const handleDialogClose = () => {
  // Jangan tutup jika sedang loading (opsional, tergantung kebutuhan)
  if (props.loading || props.preventClose) return;

  console.log("🛑 BaseModal: Dialog @close triggered (klik luar/ESC). Emitting 'close'...");
  emit('close');
};

// Logika untuk menentukan lebar modal berdasarkan prop 'size'
const maxWidthClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'max-w-sm';
    case 'md': return 'max-w-md';
    case 'lg': return 'max-w-lg';
    case 'xl': return 'max-w-xl';
    case '2xl': return 'max-w-2xl';
    case '3xl': return 'max-w-3xl';
    case '4xl': return 'max-w-4xl';
    case '5xl': return 'max-w-5xl';
    default: return 'max-w-md';
  }
});
</script>

<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="handleDialogClose" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/50 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <TransitionChild as="template" enter="duration-300 ease-out"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100" leave="duration-200 ease-in"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">

            <DialogPanel :class="[
              'relative transform overflow-hidden rounded-lg bg-surface-card text-left shadow-xl transition-all sm:my-8 w-full border border-border-default',
              maxWidthClass
            ]">

              <div class="bg-surface-subtle px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-text-primary">
                      <slot name="header">
                        Judul Default
                      </slot>
                    </DialogTitle>

                    <div class="mt-4">
                      <slot name="body">
                        <p class="text-sm text-text-muted">Konten default...</p>
                      </slot>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="!hideFooter" class="bg-surface-subtle border-t border-border-default px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <slot name="footer">
                  <button type="button"
                    class="inline-flex w-full justify-center rounded-md bg-brand-primary px-3 py-2 text-sm font-semibold text-text-inverse shadow-none hover:bg-brand-primary-hover sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="loading" @click="emit('confirm')">
                    <span v-if="loading" class="flex items-center">
                      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                      </svg>
                      Memproses...
                    </span>
                    <span v-else>Konfirmasi</span>
                  </button>
                  <button type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-surface-card px-3 py-2 text-sm font-semibold text-text-secondary border border-border-default hover:bg-surface-hover hover:text-text-primary sm:mt-0 sm:w-auto"
                    @click="emit('close')" :disabled="loading">
                    Batal
                  </button>
                </slot>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>