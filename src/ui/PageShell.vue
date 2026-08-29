<script setup>
import { useSlots } from 'vue'

/** Satu container untuk SEMUA halaman aplikasi. Menghentikan konten meloncat antar-halaman. */
const props = defineProps({
  title:    { type: String, default: '' },
  subtitle: { type: String, default: '' },
  /** 'default' = lebar aplikasi · 'narrow' = halaman baca/editor (panjang baris terjaga) */
  width:    { type: String, default: 'default' },
})
const slots = useSlots()
</script>

<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full mx-auto" :class="props.width === 'narrow' ? 'max-w-3xl' : 'max-w-9xl'">
    <header v-if="title || slots.actions" class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div v-if="title">
        <h1 class="text-2xl font-bold text-text-primary tracking-tight">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-text-muted mt-0.5">{{ subtitle }}</p>
      </div>
      <div v-if="slots.actions" class="flex flex-wrap gap-2"><slot name="actions" /></div>
    </header>
    <slot />
  </div>
</template>
