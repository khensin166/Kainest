<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from './cn'

const badge = cva(
  'inline-flex items-center gap-1 font-semibold rounded-sm px-2 py-0.5 text-xs whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'bg-surface-hover text-text-secondary',
        brand:   'bg-brand-surface text-brand-primary',
        success: 'bg-status-success-bg text-status-success-text',
        danger:  'bg-status-danger-bg text-status-danger-text',
        warning: 'bg-status-warning-bg text-status-warning-text',
        info:    'bg-status-info-bg text-status-info-text',
      },
    },
    defaultVariants: { tone: 'neutral' },
  }
)

const props = defineProps({
  tone:  { type: String, default: 'neutral' },
  class: { type: null, default: '' },
})
const classes = computed(() => cn(badge({ tone: props.tone }), props.class))
</script>

<template><span :class="classes"><slot /></span></template>
