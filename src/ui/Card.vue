<script setup>
import { computed, useSlots } from 'vue'
import { cn } from './cn'

const props = defineProps({
  padded:      { type: Boolean, default: true },
  interactive: { type: Boolean, default: false },
  class:       { type: null, default: '' },
})
const slots = useSlots()
const classes = computed(() =>
  cn(
    'bg-surface-card border border-border-default rounded-lg overflow-hidden',
    props.interactive && 'transition-colors hover:border-border-strong',
    props.class
  )
)
</script>

<template>
  <div :class="classes">
    <div v-if="slots.header" class="flex items-center gap-2 px-5 py-4 border-b border-border-default">
      <slot name="header" />
    </div>
    <div :class="padded ? 'p-5' : ''"><slot /></div>
    <div v-if="slots.footer" class="px-5 py-4 border-t border-border-default bg-surface-subtle">
      <slot name="footer" />
    </div>
  </div>
</template>
