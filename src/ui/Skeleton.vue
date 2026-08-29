<script setup>
import { computed } from 'vue'
import { cn } from './cn'
const props = defineProps({ class: { type: null, default: '' } })
const classes = computed(() => cn('bg-surface-hover animate-pulse rounded-sm', props.class))
</script>
<template><div :class="classes" aria-hidden="true" /></template>
