<script setup>
import { IconCheck, IconChevronDown } from './icons';
import {
  SelectRoot, SelectTrigger, SelectValue, SelectIcon,
  SelectPortal, SelectContent, SelectViewport, SelectItem, SelectItemText,
} from 'reka-ui'
import { cn } from './cn'

/** options: [{ value, label }] */
const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  options:     { type: Array, default: () => [] },
  placeholder: { type: String, default: 'Pilih...' },
  disabled:    { type: Boolean, default: false },
  class:       { type: null, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <SelectRoot
    :model-value="String(modelValue)"
    :disabled="disabled"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <SelectTrigger
      :class="cn( 'inline-flex items-center justify-between gap-2 w-full h-10 px-3 text-sm rounded-md', 'bg-surface-input border border-border-default text-text-primary cursor-pointer transition-colors', 'hover:border-border-strong focus:outline-none focus:ring-2 focus:ring-brand-primary', 'disabled:opacity-60 disabled:cursor-not-allowed data-[placeholder]:text-text-muted', props.class )"
    >
      <SelectValue :placeholder="placeholder" />
      <SelectIcon><IconChevronDown class="w-4 h-4 text-text-muted shrink-0" /></SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        position="popper"
        :side-offset="4"
        class="z-50 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md bg-surface-card border border-border-default"
      >
        <SelectViewport class="p-1 max-h-64 overflow-y-auto">
          <SelectItem
            v-for="opt in options"
            :key="opt.value"
            :value="String(opt.value)"
            class="relative flex items-center gap-2 px-2 py-2 pr-8 text-sm rounded-sm cursor-pointer select-none text-text-secondary data-[highlighted]:bg-surface-hover data-[highlighted]:text-text-primary data-[state=checked]:text-brand-primary data-[state=checked]:font-semibold focus-visible:outline-none"
          >
            <SelectItemText>{{ opt.label }}</SelectItemText>
            <IconCheck class="absolute right-2 w-4 h-4 opacity-0 data-[state=checked]:opacity-100" />
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
