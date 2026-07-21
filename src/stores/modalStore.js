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
  const deleteConfirmLabel = ref("Hapus"); // Label tombol konfirmasi (bisa diubah)
  const deleteAction = ref(null);
  const isDeleting = ref(false);

  // =========================================
  // 3. STATE BARU UNTUK CONTENT MODAL (S&K, Kebijakan Privasi)
  // =========================================
  const isContentOpen = ref(false);
  const contentTitle = ref("");
  const contentBody = ref("");

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
  // ACTIONS UNTUK CONTENT MODAL
  // =========================================
  function openContentModal({ title, htmlBody }) {
    contentTitle.value = title;
    contentBody.value = htmlBody;
    isContentOpen.value = true;
  }

  function closeContentModal() {
    isContentOpen.value = false;
    // Delay clearing content for animation
    setTimeout(() => {
      contentTitle.value = "";
      contentBody.value = "";
    }, 300);
  }

  // =========================================
  // ACTIONS BARU UNTUK DELETE MODAL
  // =========================================
  function openDeleteModal({ title, message, onConfirm, confirmLabel = 'Hapus' }) {
    if (title) deleteTitle.value = title;
    if (message) deleteMessage.value = message;
    deleteConfirmLabel.value = confirmLabel;
    deleteAction.value = onConfirm;
    isDeleteOpen.value = true;
  }

  function closeDeleteModal() {
    isDeleteOpen.value = false;
    deleteAction.value = null;
    isDeleting.value = false;
    // Reset ke default
    deleteTitle.value = "Hapus Item?";
    deleteMessage.value = "Apakah Anda yakin? Tindakan ini tidak dapat dibatalkan.";
    deleteConfirmLabel.value = "Hapus";
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
    
    isContentOpen,
    contentTitle,
    contentBody,
    openContentModal,
    closeContentModal,

    isDeleteOpen,
    deleteTitle,
    deleteMessage,
    deleteConfirmLabel,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDeleteAction,
  };
});
