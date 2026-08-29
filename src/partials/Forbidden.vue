<template>
  <div class="flex flex-col items-center justify-center h-screen bg-surface-page">
    <h1 class="text-4xl font-bold text-text-primary">403 - Forbidden</h1>
    <p class="mt-4 text-lg text-text-muted">
      You do not have permission to access this page.
    </p>
    <router-link
      to="/"
      class="mt-6 px-4 py-2 bg-brand-primary text-text-inverse rounded-lg hover:bg-brand-primary-hover transition"
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