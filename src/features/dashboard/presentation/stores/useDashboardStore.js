import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getSystemUpdatesUseCase,
  syncSystemUpdatesUseCase,
  getFeedbacksUseCase,
  submitFeedbackUseCase,
  hideFeedbackUseCase,
} from "@/core/di/di";

export const useDashboardStore = defineStore("dashboard", () => {
  const updates = ref([]);
  const isLoadingUpdates = ref(true);
  const isSyncing = ref(false);

  const feedbacks = ref([]);
  const isLoadingFeedbacks = ref(true);
  const isSubmittingFeedback = ref(false);

  async function fetchSystemUpdates() {
    isLoadingUpdates.value = true;
    const result = await getSystemUpdatesUseCase.execute();
    if (result.right) updates.value = result.right;
    else console.error("Gagal memuat system updates:", result.left?.message);
    isLoadingUpdates.value = false;
  }

  /** @returns {{ ok: boolean, newlyAdded?: number, blasted?: number, message?: string }} */
  async function syncSystemUpdates() {
    if (isSyncing.value) return { ok: false };
    isSyncing.value = true;
    const result = await syncSystemUpdatesUseCase.execute();
    isSyncing.value = false;
    if (result.right) {
      await fetchSystemUpdates();
      return { ok: true, ...result.right };
    }
    return { ok: false, message: result.left?.message };
  }

  async function fetchFeedbacks() {
    isLoadingFeedbacks.value = true;
    const result = await getFeedbacksUseCase.execute();
    if (result.right) feedbacks.value = result.right;
    else console.warn("Gagal memuat feedback:", result.left?.message);
    isLoadingFeedbacks.value = false;
  }

  async function submitFeedback(payload) {
    isSubmittingFeedback.value = true;
    const result = await submitFeedbackUseCase.execute(payload);
    if (result.right) await fetchFeedbacks();
    else console.error("Gagal mengirim feedback:", result.left?.message);
    isSubmittingFeedback.value = false;
    return !!result.right;
  }

  async function hideFeedback(id) {
    const result = await hideFeedbackUseCase.execute(id);
    if (result.right) feedbacks.value = feedbacks.value.filter((f) => f.id !== id);
    else console.error("Gagal menyembunyikan feedback:", result.left?.message);
  }

  return {
    updates, isLoadingUpdates, isSyncing,
    feedbacks, isLoadingFeedbacks, isSubmittingFeedback,
    fetchSystemUpdates, syncSystemUpdates,
    fetchFeedbacks, submitFeedback, hideFeedback,
  };
});
