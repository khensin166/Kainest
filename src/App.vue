<template>
  <!-- <router-view /> -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

  <GlobalResponseModal />
  <GlobalDeleteModal />
  <SpeedInsights />
</template>

<script setup>
import "./charts/ChartjsConfig";
import { SpeedInsights } from "@vercel/speed-insights/vue"
import GlobalResponseModal from "./components/modals/GlobalResponseModal.vue";
import GlobalDeleteModal from "./components/modals/GlobalDeleteModal.vue";
</script>
