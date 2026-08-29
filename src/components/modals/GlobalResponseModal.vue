<!-- GlobalResponModal -->
<template>
  <BaseModal :isOpen="modalStore.isOpen" @close="modalStore.closeModal">
    <template #header>
      <DialogTitle
        as="h3"
        class="text-lg font-medium leading-6 flex items-center space-x-3"
        :class="headerClass"
      >
        <IconCheckCircle
          v-if="modalStore.status === 'success'"
          class="h-6 w-6"
        />
        <IconCancel v-if="modalStore.status === 'error'" class="h-6 w-6" />
        <span>{{ modalStore.title }}</span>
      </DialogTitle>
    </template>
    <template #body>
      <div v-if="timer > 0" class="text-center mt-4">
        <p class="text-sm text-text-muted">
          {{ modalStore.message }}
        </p>
        <p class="text-lg font-medium text-text-primary mt-2">
          Anda bisa mencoba lagi dalam <strong>{{ timer }}</strong> detik.
        </p>
      </div>
      <p v-else class="text-sm text-text-muted mt-4">
        {{ modalStore.message }}
      </p>
    </template>
    <template #footer>
      <button
        @click="modalStore.closeModal"
        type="button"
        :disabled="timer > 0"
        class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none disabled:opacity-50 disabled:bg-surface-subtle disabled:cursor-not-allowed"
        :class="buttonClass"
      >
        Tutup
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { IconCancel, IconCheckCircle } from '@/ui/icons';
import { computed, ref, watch, onUnmounted } from "vue";
import { useModalStore } from "../../stores/modalStore";
import BaseModal from "./BaseModal.vue";
import { DialogTitle } from "reka-ui";

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
      return "text-status-success";
    case "error":
      return "text-status-danger";
    default:
      return "text-text-primary";
  }
});

const buttonClass = computed(() => {
  switch (modalStore.status) {
    case "success":
      return "bg-status-success hover:bg-status-success/90 text-status-success-text";
    case "error":
      return "bg-status-danger hover:bg-status-danger/90 text-white";
    default:
      return "bg-surface-card border border-border-default text-text-secondary hover:text-text-primary hover:bg-surface-hover";
  }
});
</script>
