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

  /**
   * GET /api/budget/trend
   * Mengambil data transaksi harian yang diagregasi
   */
  async getSpendingTrend() {
    const response = await apiClient.get("/budget/trend");
    return response.data;
    // Mengharapkan: { success: true, data: { month: '...', trend: [{date: '...', totalSpent: ...}] } }
  }

  /**
   * BARU: GET /api/budget/transactions (List dengan filter & pagination)
   * @param {object} params - { page, limit, startDate, endDate }
   */
  async getTransactions(params = {}) {
    // Axios akan otomatis mengubah objek params menjadi query string di URL
    // Contoh: /budget/transactions?page=1&limit=10
    const response = await apiClient.get("/budget/transactions", { params });
    return response.data;
    // Mengharapkan: { success: true, data: [...], meta: {...} }
  }

  /**
   * BARU: GET /api/budget/transactions/:id (Detail)
   */
  async getTransactionById(id) {
    const response = await apiClient.get(`/budget/transactions/${id}`);
    return response.data;
  }

  /**
   * BARU: PUT /api/budget/transactions/:id (Update)
   */
  async updateTransaction(id, data) {
    const response = await apiClient.put(`/budget/transactions/${id}`, data);
    return response.data;
  }

  /**
   * BARU: DELETE /api/budget/transactions/:id (Hapus)
   */
  async deleteTransaction(id) {
    const response = await apiClient.delete(`/budget/transactions/${id}`);
    return response.data;
  }
}
