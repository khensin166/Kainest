<!-- BaseModal.vue — perilaku dialog dari reka-ui, API publik tidak berubah. -->
<script setup>
import { computed } from 'vue';
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle } from 'reka-ui';
import { Button } from '@/ui';

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  loading: { type: Boolean, default: false },
  hideFooter: { type: Boolean, default: false },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm','md','lg','xl','2xl','3xl','4xl','5xl'].includes(v),
  },
  preventClose: { type: Boolean, default: false },
});

const emit = defineEmits(['close', 'confirm']);

/** Dipanggil reka-ui saat Esc / klik di luar. Dialog ini terkontrol penuh oleh prop `isOpen`. */
const onOpenChange = (open) => {
  if (open) return;
  if (props.loading || props.preventClose) return;
  emit('close');
};

/** Ditulis literal — Tailwind memindai teks sumber, class dinamis tidak akan ter-generate. */
const SIZE_CLASS = {
  sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl',
  '2xl': 'max-w-2xl', '3xl': 'max-w-3xl', '4xl': 'max-w-4xl', '5xl': 'max-w-5xl',
};
const maxWidthClass = computed(() => SIZE_CLASS[props.size] ?? SIZE_CLASS.md);
</script>

<template>
  <DialogRoot :open="isOpen" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/50 kainest-fade-in" />
      <DialogContent
        :class="[ 'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)]', 'bg-surface-card border border-border-default rounded-lg overflow-hidden text-left', 'max-h-[calc(100dvh-4rem)] flex flex-col focus:outline-none kainest-pop-in', maxWidthClass, ]"
      >
        <div class="bg-surface-subtle px-4 pt-5 pb-4 sm:p-6 overflow-y-auto flex-1">
          <DialogTitle as="h3" class="text-lg font-medium leading-6 text-text-primary">
            <slot name="header">Judul Default</slot>
          </DialogTitle>
          <div class="mt-4">
            <slot name="body">
              <p class="text-sm text-text-muted">Konten default...</p>
            </slot>
          </div>
        </div>

        <div
          v-if="!hideFooter"
          class="bg-surface-subtle border-t border-border-default px-4 py-3 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:px-6"
        >
          <slot name="footer">
            <Button variant="secondary" :disabled="loading" @click="emit('close')">Batal</Button>
            <Button variant="primary" :loading="loading" @click="emit('confirm')">
              {{ loading ? 'Memproses...' : 'Konfirmasi' }}
            </Button>
          </slot>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
