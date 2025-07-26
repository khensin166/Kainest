<template>
  <router-view />

  <GlobalResponseModal />
</template>

<script setup>
import "./charts/ChartjsConfig";
import GlobalResponseModal from "./components/modals/GlobalResponseModal.vue";
</script>
