<!-- GlobalResponModal -->
<template>
  <BaseModal :isOpen="modalStore.isOpen" @close="modalStore.closeModal">
    <template #header>
      <DialogTitle
        as="h3"
        class="text-lg font-medium leading-6 flex items-center space-x-3"
        :class="headerClass"
      >
        <CheckCircleIcon
          v-if="modalStore.status === 'success'"
          class="h-6 w-6"
        />
        <XCircleIcon v-if="modalStore.status === 'error'" class="h-6 w-6" />
        <span>{{ modalStore.title }}</span>
      </DialogTitle>
    </template>
    <template #body>
      <div v-if="timer > 0" class="text-center mt-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ modalStore.message }}
        </p>
        <p class="text-lg font-medium text-gray-800 dark:text-gray-200 mt-2">
          Anda bisa mencoba lagi dalam <strong>{{ timer }}</strong> detik.
        </p>
      </div>
      <p v-else class="text-sm text-gray-500 dark:text-gray-400 mt-4">
        {{ modalStore.message }}
      </p>
    </template>
    <template #footer>
      <button
        @click="modalStore.closeModal"
        type="button"
        :disabled="timer > 0"
        class="px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        :class="buttonClass"
      >
        Tutup
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { computed, ref, watch, onUnmounted } from "vue";
import { useModalStore } from "../../stores/modalStore";
import BaseModal from "./BaseModal.vue";
import { DialogTitle } from "@headlessui/vue";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/24/outline";

const modalStore = useModalStore();

// PERUBAHAN: Logika untuk menangani countdown
const timer = ref(0);
let intervalId = null;

// Mengawasi perubahan pada state 'isOpen' di store
watch(
  () => modalStore.isOpen,
  (isOpen) => {
    clearInterval(intervalId);
    if (isOpen && modalStore.countdown > 0) {
      timer.value = modalStore.countdown;
      intervalId = setInterval(() => {
        if (timer.value > 0) {
          timer.value--;
        } else {
          clearInterval(intervalId);
        }
      }, 1000);
    } else {
      timer.value = 0;
    }
  }
);

onUnmounted(() => {
  clearInterval(intervalId);
});

// Computed property untuk styling dinamis (tidak ada perubahan)
const headerClass = computed(() => {
  switch (modalStore.status) {
    case "success":
      return "text-green-700 dark:text-green-400";
    case "error":
      return "text-red-700 dark:text-red-400";
    default:
      return "text-gray-900 dark:text-gray-100";
  }
});

const buttonClass = computed(() => {
  switch (modalStore.status) {
    case "success":
      return "bg-green-600 hover:bg-green-700";
    case "error":
      return "bg-red-600 hover:bg-red-700";
    default:
      return "bg-gray-600 hover:bg-gray-700";
  }
});
</script>
