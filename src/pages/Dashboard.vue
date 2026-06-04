<template>
  <div class="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
    
    <div class="grid grid-cols-12 gap-6">
      <!-- Left Column -->
      <div class="col-span-12 xl:col-span-8 space-y-6">
        <DashboardWelcome />
        <DashboardRecentActivity />
      </div>

      <!-- Right Column -->
      <div class="col-span-12 xl:col-span-4 space-y-6">
        <DashboardSystemUpdates />
        <DashboardFeedback />
      </div>
    </div>
    
  </div>
</template>

<script setup>
import DashboardWelcome from '../partials/dashboard/DashboardWelcome.vue';
import DashboardRecentActivity from '../partials/dashboard/DashboardRecentActivity.vue';
import DashboardSystemUpdates from '../partials/dashboard/DashboardSystemUpdates.vue';
import DashboardFeedback from '../partials/dashboard/DashboardFeedback.vue';
</script>
