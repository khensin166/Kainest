// src/features/budgeting/domain/repository/IBudgetRepository.js
//
// Kontrak repository untuk fitur budgeting. Implementasinya ada di
// `data/repository/`. Interface ini membuat dependency inversion menjadi
// eksplisit — sebelumnya hanya tersirat, sehingga tidak ada yang menjaga
// bila implementasi berubah.
//
// Semua method mengembalikan Either: left(Failure) | right(Entity).

export class IBudgetRepository {
  getMonthlySummary() {
    throw new Error("Method not implemented.");
  }
  getAiAdvice(categoryId) {
    throw new Error("Method not implemented.");
  }
  createTransaction(data) {
    throw new Error("Method not implemented.");
  }
  getCategories() {
    throw new Error("Method not implemented.");
  }
  createCategory(data) {
    throw new Error("Method not implemented.");
  }
  getSpendingTrend(params) {
    throw new Error("Method not implemented.");
  }
  getTransactions(params) {
    throw new Error("Method not implemented.");
  }
  getTransactionById(id) {
    throw new Error("Method not implemented.");
  }
  updateTransaction(id, data) {
    throw new Error("Method not implemented.");
  }
  deleteTransaction(id) {
    throw new Error("Method not implemented.");
  }
  setupBudget(data) {
    throw new Error("Method not implemented.");
  }
  getPockets() {
    throw new Error("Method not implemented.");
  }
  upsertPocket(data) {
    throw new Error("Method not implemented.");
  }
  deletePocket(id) {
    throw new Error("Method not implemented.");
  }
  bulkSetupPockets(data) {
    throw new Error("Method not implemented.");
  }
  updatePocketKeywords(id, keywords) {
    throw new Error("Method not implemented.");
  }
  classifyTransaction(data) {
    throw new Error("Method not implemented.");
  }
  getMonthlyHistory(params) {
    throw new Error("Method not implemented.");
  }
  getAiSuggestion() {
    throw new Error("Method not implemented.");
  }
  applyAiSuggestion(suggestionId) {
    throw new Error("Method not implemented.");
  }
  dismissAiSuggestion(suggestionId) {
    throw new Error("Method not implemented.");
  }
}
