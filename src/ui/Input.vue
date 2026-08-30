<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, useSlots } from 'vue'
import { cn } from './cn'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  size:       { type: String, default: 'md' },
  invalid:    { type: Boolean, default: false },
  class:      { type: null, default: '' },
})
defineEmits(['update:modelValue'])
const slots = useSlots()

const H = { sm: 'h-8 text-xs', md: 'h-10 text-sm', lg: 'h-12 text-base' }
const classes = computed(() =>
  cn(
    'w-full bg-surface-input border rounded-md text-text-primary placeholder:text-text-muted',
    'transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    H[props.size],
    slots.prefix ? 'pl-10' : 'pl-3',
    slots.suffix ? 'pr-10' : 'pr-3',
    props.invalid && 'border-status-danger focus:ring-status-danger focus:border-status-danger',
    !props.invalid && 'border-border-default',
    props.class
  )
)
</script>

<template>
  <div class="relative">
    <span v-if="slots.prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
      <slot name="prefix" />
    </span>
    <input
      v-bind="$attrs"
      :value="modelValue"
      :class="classes"
      :aria-invalid="invalid || undefined"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <span v-if="slots.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted">
      <slot name="suffix" />
    </span>
  </div>
</template>
