// src/stores/modalStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modal", () => {
  // =========================================
  // 1. STATE UNTUK GLOBAL RESPONSE MODAL (Sukses/Error)
  // =========================================
  const isOpen = ref(false);
  const title = ref("");
  const message = ref("");
  const status = ref("info"); // bisa 'success', 'error', 'warning', 'info'
  const countdown = ref(0);

  // =========================================
  // 2. STATE BARU UNTUK GLOBAL DELETE MODAL
  // =========================================
  const isDeleteOpen = ref(false);
  const deleteTitle = ref("Hapus Item?");
  const deleteMessage = ref(
    "Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan."
  );
  const deleteAction = ref(null);
  const isDeleting = ref(false);

  // =========================================
  // ACTIONS UNTUK RESPONSE MODAL
  // =========================================
  function openModal({
    newTitle,
    newMessage,
    newStatus = "info",
    newCountdown = 0,
  }) {
    title.value = newTitle;
    message.value = newMessage;
    status.value = newStatus;
    countdown.value = newCountdown;
    isOpen.value = true;
  }

  function closeModal() {
    isOpen.value = false;
    countdown.value = 0;
  }

  // =========================================
  // ACTIONS BARU UNTUK DELETE MODAL
  // =========================================
  function openDeleteModal({ title, message, onConfirm }) {
    if (title) deleteTitle.value = title;
    if (message) deleteMessage.value = message;
    deleteAction.value = onConfirm;
    isDeleteOpen.value = true;
  }

  function closeDeleteModal() {
    isDeleteOpen.value = false;
    deleteAction.value = null;
    isDeleting.value = false;
    // Reset pesan ke default (opsional)
    deleteTitle.value = "Hapus Item?";
    deleteMessage.value =
      "Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan.";
  }

  async function confirmDeleteAction() {
    if (!deleteAction.value) return;

    isDeleting.value = true;
    try {
      await deleteAction.value();
      closeDeleteModal();
    } catch (error) {
      console.error("Error saat menghapus:", error);
      isDeleting.value = false;
    }
  }

  return {
    isOpen,
    title,
    message,
    status,
    countdown,
    openModal,
    closeModal,
    isDeleteOpen,
    deleteTitle,
    deleteMessage,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteAction,
  };
});
