<script setup>
import { cn } from './cn'
/** Indikator memuat. Sebelumnya di-copy-paste sebagai inline SVG di 13 tempat. */
const props = defineProps({ class: { type: null, default: 'w-4 h-4' } })
</script>

<template>
  <svg :class="cn('animate-spin shrink-0', props.class)" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
</template>
