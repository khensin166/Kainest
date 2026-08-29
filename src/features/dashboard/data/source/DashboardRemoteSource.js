import apiClient from "@/lib/apiClient";

/**
 * Endpoint dan payload SAMA PERSIS dengan panggilan langsung sebelumnya —
 * yang berubah hanya jalurnya, sehingga interceptor 401/403 ikut aktif.
 */
export class DashboardRemoteSource {
  // GET /system-updates
  async getSystemUpdates() {
    const response = await apiClient.get("/system-updates");
    return response.data; // { updates: [...] }
  }

  // POST /system-updates/sync  (body kosong)
  async syncSystemUpdates() {
    const response = await apiClient.post("/system-updates/sync", {});
    return response.data; // { newlyAdded, blasted }
  }

  // GET /feedbacks
  async getFeedbacks() {
    const response = await apiClient.get("/feedbacks");
    return response.data; // { feedbacks: [...] }
  }

  // POST /feedbacks  { message, rating? }
  async submitFeedback(payload) {
    const response = await apiClient.post("/feedbacks", payload);
    return response.data;
  }

  // PATCH /feedbacks/:id/visibility  (body kosong)
  async hideFeedback(id) {
    const response = await apiClient.patch(`/feedbacks/${id}/visibility`, {});
    return response.data;
  }
}
