import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useModalStore = defineStore('modal', () => {
  // State
  const isOpen = ref(false);
  const title = ref('');
  const message = ref('');
  const status = ref('info'); // bisa 'success', 'error', 'warning', 'info'
  const countdown = ref(0); // variable penampung waktu

  // Actions
  function openModal({ newTitle, newMessage, newStatus = 'info', newCountdown = 0  }) {
    title.value = newTitle;
    message.value = newMessage;
    status.value = newStatus;
    countdown.value = newCountdown; // simpan nilainya
    isOpen.value = true;
  }

  function closeModal() {
    isOpen.value = false;
    countdown.value = 0; // reset countdown saat modal ditutup
  }

  return { isOpen, title, message, status, countdown,  openModal, closeModal };
});