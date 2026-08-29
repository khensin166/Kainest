<script setup>
import { computed } from 'vue'
import { cva } from 'class-variance-authority'
import { cn } from './cn'
import Spinner from './Spinner.vue'

/**
 * Satu-satunya tempat memutuskan bentuk tombol Kainest.
 * Menambah varian = keputusan design system, bukan keputusan per-halaman.
 */
const button = cva(
  'inline-flex items-center justify-center gap-2 font-semibold whitespace-nowrap ' +
  'transition-colors cursor-pointer select-none border ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page ' +
  'disabled:opacity-60 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:   'bg-brand-primary hover:bg-brand-primary-hover text-text-inverse border-transparent',
        secondary: 'bg-surface-card hover:bg-surface-hover text-text-primary border-border-default hover:border-border-strong',
        ghost:     'bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary border-transparent',
        danger:    'bg-status-danger hover:opacity-90 text-white border-transparent',
        // link memakai --color-brand-text (token TEKS berwarna brand), bukan --color-brand-primary
        // yang dirancang sebagai warna PERMUKAAN — kontrasnya kurang saat dipakai sebagai teks.
        link:      'bg-transparent border-transparent text-brand-text hover:underline px-0 h-auto',
      },
      size: {
        sm: 'h-8  px-3 text-xs  rounded-md',
        md: 'h-10 px-4 text-sm  rounded-md',
        lg: 'h-12 px-6 text-base rounded-lg',
        icon: 'h-10 w-10 p-0 rounded-md',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size:    { type: String, default: 'md' },
  as:      { type: [String, Object], default: 'button' },
  block:   { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  class:   { type: null, default: '' },
})

const classes = computed(() =>
  cn(button({ variant: props.variant, size: props.size }), props.block && 'w-full', props.class)
)
</script>

<template>
  <component :is="as" :class="classes" :disabled="as === 'button' ? ($attrs.disabled || loading) : undefined" :aria-busy="loading || undefined">
    <Spinner v-if="loading" class="h-4 w-4" />
    <slot />
  </component>
</template>
