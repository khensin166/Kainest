<template>
  <BaseModal :isOpen="modalStore.isContentOpen" @close="modalStore.closeContentModal">
    <!-- Header -->
    <template #header>
      <DialogTitle as="h3" class="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <span>{{ modalStore.contentTitle }}</span>
      </DialogTitle>
    </template>

    <!-- Body (Scrollable) -->
    <template #body>
      <div 
        class="mt-4 max-h-[60vh] overflow-y-auto pr-2 pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 prose prose-sm dark:prose-invert"
        v-html="modalStore.contentBody"
      >
      </div>
    </template>

    <!-- Footer -->
    <template #footer>
      <button
        @click="modalStore.closeContentModal"
        type="button"
        class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
      >
        Saya Mengerti
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { useModalStore } from "../../stores/modalStore";
import BaseModal from "./BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";

const modalStore = useModalStore();
</script>
