<script setup>
import { SwitchRoot, SwitchThumb } from 'reka-ui'
import { cn } from './cn'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  disabled:   { type: Boolean, default: false },
  class:      { type: null, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <SwitchRoot
    :model-value="modelValue"
    :disabled="disabled"
    :class="cn( 'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-page', 'disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer', 'data-[state=checked]:bg-brand-primary data-[state=unchecked]:bg-surface-hover', props.class )"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <SwitchThumb
      class="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-[22px] data-[state=unchecked]:translate-x-0.5"
    />
  </SwitchRoot>
</template>
