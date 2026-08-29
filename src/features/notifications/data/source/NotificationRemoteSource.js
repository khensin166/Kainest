import apiClient from "@/lib/apiClient";

/** Endpoint dan payload sama persis dengan panggilan langsung sebelumnya. */
export class NotificationRemoteSource {
  // GET /notifications
  async getNotifications() {
    const response = await apiClient.get("/notifications");
    return response.data; // { notifications: [...], unreadCount }
  }

  // PATCH /notifications/:id/read  (body kosong)
  async markAsRead(id) {
    const response = await apiClient.patch(`/notifications/${id}/read`, {});
    return response.data;
  }
}
