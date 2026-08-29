import { defineStore } from "pinia";
import { ref } from "vue";
import { getNotificationsUseCase, markNotificationReadUseCase } from "@/core/di/di";

export const useNotificationStore = defineStore("notifications", () => {
  const notifications = ref([]);
  const unreadCount = ref(0);
  const isLoading = ref(true);

  async function fetchNotifications() {
    isLoading.value = true;
    const result = await getNotificationsUseCase.execute();
    if (result.right) {
      notifications.value = result.right.notifications;
      unreadCount.value = result.right.unreadCount;
    } else {
      console.warn("Gagal memuat notifikasi:", result.left?.message);
    }
    isLoading.value = false;
  }

  async function markAsRead(notif) {
    if (notif.isRead) return;
    const result = await markNotificationReadUseCase.execute(notif.id);
    if (result.right) {
      notif.isRead = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    } else {
      console.warn("Gagal menandai notifikasi:", result.left?.message);
    }
  }

  return { notifications, unreadCount, isLoading, fetchNotifications, markAsRead };
});
