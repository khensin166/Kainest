<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
    <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100">403 - Forbidden</h1>
    <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
      You do not have permission to access this page.
    </p>
    <router-link
      to="/"
      class="mt-6 px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
    >
      Back to Dashboard
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Forbidden',
};
</script>