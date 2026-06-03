<template>
  <div class="flex flex-col items-center justify-center text-center w-full" :class="heightClass">
    <div class="text-5xl mb-4">{{ icon }}</div>
    <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300">{{ title }}</h3>
    <p class="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-sm">
      {{ message }}
    </p>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  icon: {
    type: String,
    default: "📭"
  },
  title: {
    type: String,
    default: "Belum ada data"
  },
  message: {
    type: String,
    default: "Data belum tersedia untuk saat ini."
  },
  heightClass: {
    type: String,
    default: "h-64"
  }
});
</script>
