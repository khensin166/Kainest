<script setup>
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'reka-ui'
import { cn } from './cn'

/** items: [{ value, label }] */
const props = defineProps({
  modelValue: { type: String, default: '' },
  items:      { type: Array, default: () => [] },
  class:      { type: null, default: '' },
})
defineEmits(['update:modelValue'])
</script>

<template>
  <TabsRoot
    :model-value="modelValue"
    :class="cn('w-full', props.class)"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <TabsList class="flex p-1 bg-surface-subtle rounded-md w-full border border-border-default gap-1">
      <TabsTrigger
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        class="flex-1 py-2 text-sm font-medium rounded-sm transition-colors cursor-pointer text-text-secondary hover:text-text-primary data-[state=active]:bg-surface-card data-[state=active]:text-text-primary data-[state=active]:font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
      >
        {{ item.label }}
      </TabsTrigger>
    </TabsList>
    <TabsContent v-for="item in items" :key="item.value" :value="item.value" class="mt-4 focus-visible:outline-none">
      <slot :name="item.value" />
    </TabsContent>
  </TabsRoot>
</template>
