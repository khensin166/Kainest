<script setup>
import { IconTrendDown, IconTrendUp } from './icons';
import { computed } from 'vue'
import Card from './Card.vue'
import Badge from './Badge.vue'
import Skeleton from './Skeleton.vue'

const props = defineProps({
  label:   { type: String, required: true },
  value:   { type: [String, Number], default: '' },
  icon:    { type: [Object, Function], default: null },
  loading: { type: Boolean, default: false },
  /** perubahan bulan-ke-bulan, dalam persen. null = tidak ditampilkan. */
  delta:   { type: Number, default: null },
  /** true bila naik itu BURUK (mis. pengeluaran) */
  deltaInvert: { type: Boolean, default: false },
  /** teks pengganti saat delta tidak tersedia */
  fallback: { type: String, default: '' },
  /** keterangan tambahan di bawah kartu */
  hint:     { type: String, default: '' },
})

const isGood = computed(() =>
  props.deltaInvert ? props.delta <= 0 : props.delta >= 0
)
</script>

<template>
  <Card :padded="false" interactive>
    <div class="p-4">
      <div class="flex items-center justify-between gap-2 mb-3">
        <span class="text-xs font-medium text-text-muted">{{ label }}</span>
        <div v-if="icon" class="w-8 h-8 rounded-md bg-surface-hover flex items-center justify-center shrink-0">
          <component :is="icon" class="w-4 h-4 text-text-secondary" aria-hidden="true" />
        </div>
      </div>

      <Skeleton v-if="loading" class="h-6 w-3/4 rounded-md" />
      <p v-else class="text-lg font-bold text-text-primary tabular-nums">{{ value }}</p>

      <div v-if="delta !== null && delta !== undefined" class="mt-2 flex items-center gap-1.5">
        <Badge :tone="isGood ? 'success' : 'danger'">
          <component :is="delta >= 0 ? IconTrendUp : IconTrendDown" class="w-3 h-3" aria-hidden="true" />
          {{ delta > 0 ? '+' : '' }}{{ delta }}%
        </Badge>
        <span class="text-xs text-text-muted">vs bln lalu</span>
      </div>
      <p v-else-if="fallback" class="mt-2 text-xs text-text-muted">{{ fallback }}</p>
      <p v-if="hint" class="mt-1 text-xs text-text-muted leading-tight">{{ hint }}</p>
    </div>
  </Card>
</template>
