import apiClient from "../../../../lib/apiClient";

export class BudgetRemoteSource {
  /**
   * GET /api/budget/summary
   * Mengambil ringkasan bulanan (Limit vs Spent per kategori)
   */
  async getMonthlySummary() {
    // Mengharapkan response: { success: true, data: { month: '...', totals: {...}, categories: [...] } }
    const response = await apiClient.get("/budget/summary");
    return response.data;
  }

  /**
   * GET /api/budget/advisor/:categoryId
   * Mengambil status zona harian (Green/Yellow/Red) dan saran AI
   */
  async getAiAdvice(categoryId) {
    // Mengharapkan response: { success: true, data: { zone: '...', advice: '...' } }
    const response = await apiClient.get(`/budget/advisor/${categoryId}`);
    return response.data;
  }

  /**
   * POST /api/budget/transactions
   * Membuat transaksi baru
   * @param {object} data - { amount, categoryId, note, date }
   */
  async createTransaction(data) {
    // Mengharapkan response: { success: true, data: { id: '...', ... } }
    const response = await apiClient.post("/budget/transactions", data);
    return response.data;
  }

  // --- Tambahan (Opsional tapi berguna untuk Form Transaksi) ---
  /**
   * GET /api/budget/categories
   * Mengambil daftar kategori untuk dropdown
   */
  async getCategories() {
    const response = await apiClient.get("/budget/categories");
    return response.data;
  }
}