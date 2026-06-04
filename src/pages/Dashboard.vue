<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto space-y-6">
    <!-- Row 1: Welcome + Quick Stats -->
    <div class="grid grid-cols-12 gap-6">
      <DashboardWelcome />
      <DashboardRecentActivity />
    </div>

    <!-- Row 2: System Updates + Feedback -->
    <div class="grid grid-cols-12 gap-6">
      <DashboardSystemUpdates />
      <DashboardFeedback />
    </div>
  </div>
</template>

<script setup>
import DashboardWelcome from '../partials/dashboard/DashboardWelcome.vue';
import DashboardRecentActivity from '../partials/dashboard/DashboardRecentActivity.vue';
import DashboardSystemUpdates from '../partials/dashboard/DashboardSystemUpdates.vue';
import DashboardFeedback from '../partials/dashboard/DashboardFeedback.vue';
</script>
