<template>
  <router-view />

  <GlobalResponseModal />
  <SpeedInsights />
</template>

<script setup>
import "./charts/ChartjsConfig";
import { SpeedInsights } from "@vercel/speed-insights/vue"
import GlobalResponseModal from "./components/modals/GlobalResponseModal.vue";
</script>
