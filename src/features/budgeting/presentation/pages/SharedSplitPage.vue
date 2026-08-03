<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Rincian Split Bill</h1>
        <p class="text-gray-500 text-sm mt-1">Dibuat dengan Kainest AI</p>
      </div>
      <div class="animate-pulse space-y-4">
        <div class="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        <div class="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const splitId = route.params.id;
</script>
