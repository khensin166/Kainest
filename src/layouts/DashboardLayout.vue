<template>
  <div class="flex h-screen overflow-hidden">
    <Sidebar :sidebarOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <div class="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      
      <Header :sidebarOpen="sidebarOpen" @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="grow">
        <router-view />
      </main>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from '../partials/Sidebar.vue';
import Header from '../partials/Header.vue';

const sidebarOpen = ref(false);
</script>