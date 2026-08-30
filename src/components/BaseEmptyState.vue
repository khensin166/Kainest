<!-- BaseEmptyState.vue — pembungkus tipis di atas primitif ui/EmptyState.
     API lama (title/message/heightClass) dipertahankan; `icon` kini komponen, bukan emoji. -->
<template>
  <div class="flex items-center justify-center w-full" :class="heightClass">
    <EmptyState :icon="icon" :title="title" :description="message">
      <slot />
    </EmptyState>
  </div>
</template>

<script setup>
import { IconInbox } from '@/ui/icons';
import { EmptyState } from '@/ui';

defineProps({
  icon:        { type: [Object, Function], default: () => IconInbox },
  title:       { type: String, default: 'Belum ada data' },
  message:     { type: String, default: 'Data belum tersedia untuk saat ini.' },
  heightClass: { type: String, default: 'h-64' },
});
</script>
