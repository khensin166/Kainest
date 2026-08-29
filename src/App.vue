<template>
  <!-- <router-view /> -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

  <GlobalResponseModal />
  <GlobalDeleteModal />
  <GlobalContentModal />
  <SpideyMoment />
  <SpeedInsights />
</template>

<script setup>
import "./charts/ChartjsConfig";
import { useTheme } from "./composables/useTheme";
import { SpeedInsights } from "@vercel/speed-insights/vue"
import GlobalResponseModal from "./components/modals/GlobalResponseModal.vue";
import GlobalDeleteModal from "./components/modals/GlobalDeleteModal.vue";
import GlobalContentModal from "./components/modals/GlobalContentModal.vue";
import SpideyMoment from "./ui/SpideyMoment.vue";

// Terapkan tema tersimpan untuk SELURUH halaman, bukan hanya yang memuat ThemeToggle.
useTheme();
</script>
