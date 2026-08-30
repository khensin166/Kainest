import apiClient from "@/lib/apiClient";

/**
 * Satu-satunya tempat fitur Rencana Keuangan menyentuh HTTP.
 * Selalu lewat apiClient agar interceptor 401/403 tetap berjalan.
 */
export class PlansRemoteSource {
  // --- Tagihan & cicilan ---
  async getBills() {
    const { data } = await apiClient.get("/plans/bills");
    return data;
  }
  async getUpcomingBills(days = 7) {
    const { data } = await apiClient.get("/plans/bills/upcoming", { params: { days } });
    return data;
  }
  async createBill(payload) {
    const { data } = await apiClient.post("/plans/bills", payload);
    return data;
  }
  async updateBill(id, payload) {
    const { data } = await apiClient.put(`/plans/bills/${id}`, payload);
    return data;
  }
  async deleteBill(id) {
    const { data } = await apiClient.delete(`/plans/bills/${id}`);
    return data;
  }
  async payBill(id, payload) {
    const { data } = await apiClient.post(`/plans/bills/${id}/pay`, payload);
    return data;
  }
  async skipBill(id) {
    const { data } = await apiClient.post(`/plans/bills/${id}/skip`, {});
    return data;
  }
  async cancelBillPayment(id) {
    const { data } = await apiClient.delete(`/plans/bills/${id}/payment`);
    return data;
  }

  // --- Wishlist tabungan ---
  async getGoals() {
    const { data } = await apiClient.get("/plans/goals");
    return data;
  }
  async createGoal(payload) {
    const { data } = await apiClient.post("/plans/goals", payload);
    return data;
  }
  async updateGoal(id, payload) {
    const { data } = await apiClient.put(`/plans/goals/${id}`, payload);
    return data;
  }
  async deleteGoal(id) {
    const { data } = await apiClient.delete(`/plans/goals/${id}`);
    return data;
  }
  async updateGoalStatus(id, status) {
    const { data } = await apiClient.patch(`/plans/goals/${id}/status`, { status });
    return data;
  }
  async contribute(id, payload) {
    const { data } = await apiClient.post(`/plans/goals/${id}/contribute`, payload);
    return data;
  }
  async getContributions(id) {
    const { data } = await apiClient.get(`/plans/goals/${id}/contributions`);
    return data;
  }

  // --- Solvabilitas ---
  async getHealth() {
    const { data } = await apiClient.get("/plans/health");
    return data;
  }

  // --- Template kantong ---
  async getTemplates() {
    const { data } = await apiClient.get("/plans/pocket-templates");
    return data;
  }
  async createTemplate(payload) {
    const { data } = await apiClient.post("/plans/pocket-templates", payload);
    return data;
  }
  async deleteTemplate(id) {
    const { data } = await apiClient.delete(`/plans/pocket-templates/${id}`);
    return data;
  }
}
