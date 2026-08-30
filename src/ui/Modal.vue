<script setup>
import { IconClose } from './icons';
import { DialogRoot, DialogPortal, DialogOverlay, DialogContent, DialogTitle, DialogDescription, DialogClose } from 'reka-ui'
import { computed, useSlots } from 'vue'
import { cn } from './cn'

const props = defineProps({
  open:        { type: Boolean, default: false },
  title:       { type: String, default: '' },
  description: { type: String, default: '' },
  size:        { type: String, default: 'md' },
  class:       { type: null, default: '' },
})
defineEmits(['update:open'])
const slots = useSlots()

const W = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
const contentClass = computed(() =>
  cn(
    'fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2',
    'bg-surface-card border border-border-default rounded-lg overflow-hidden',
    'max-h-[calc(100dvh-4rem)] flex flex-col focus:outline-none',
    W[props.size], props.class
  )
)
</script>

<template>
  <DialogRoot :open="open" @update:open="$emit('update:open', $event)">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/60" />
      <DialogContent :class="contentClass">
        <div v-if="title || slots.header" class="flex items-start gap-3 px-5 py-4 border-b border-border-default">
          <div class="flex-1 min-w-0">
            <DialogTitle v-if="title" class="text-base font-semibold text-text-primary">{{ title }}</DialogTitle>
            <DialogDescription v-if="description" class="text-sm text-text-muted mt-0.5">{{ description }}</DialogDescription>
            <slot name="header" />
          </div>
          <DialogClose
            class="shrink-0 text-text-muted hover:text-text-primary transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary rounded-sm"
            aria-label="Tutup"
          >
            <IconClose class="w-5 h-5" />
          </DialogClose>
        </div>

        <div class="p-5 overflow-y-auto flex-1"><slot /></div>

        <div v-if="slots.footer" class="px-5 py-4 border-t border-border-default bg-surface-subtle flex justify-end gap-2">
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
