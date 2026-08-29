<script setup>
import { IconInbox } from './icons';
import { useSlots } from 'vue'

defineProps({
  icon:        { type: [Object, Function], default: null },
  title:       { type: String, default: '' },
  description: { type: String, default: '' },
})
const slots = useSlots()
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center py-12 px-6">
    <div class="w-12 h-12 rounded-lg bg-surface-hover flex items-center justify-center mb-4">
      <component :is="icon || IconInbox" class="w-6 h-6 text-text-muted" aria-hidden="true" />
    </div>
    <p v-if="title" class="text-sm font-semibold text-text-primary">{{ title }}</p>
    <p v-if="description" class="text-sm text-text-muted mt-1 max-w-sm">{{ description }}</p>
    <div v-if="slots.default" class="mt-4"><slot /></div>
  </div>
</template>
