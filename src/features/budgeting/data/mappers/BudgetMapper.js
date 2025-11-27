// src/features/budgeting/data/mappers/BudgetMapper.js
import { BudgetSummaryEntity } from "../../domain/entities/BudgetSummaryEntity";
import { TransactionEntity } from "../../domain/entities/TransactionEntity";
import { CategoryEntity } from "../../domain/entities/CategoryEntity";

export const BudgetMapper = {
  /**
   * Mengubah array kategori dari API /budget/summary menjadi array BudgetSummaryEntity
   * @param {Array} apiCategories - Array kategori mentah dari API
   * @returns {BudgetSummaryEntity[]}
   */
  mapSummaryListFromApi(apiCategories) {
    if (!apiCategories || !Array.isArray(apiCategories)) return [];

    return apiCategories.map(
      (cat) =>
        new BudgetSummaryEntity({
          categoryId: cat.categoryId,
          categoryName: cat.categoryName,
          icon: cat.icon,
          limit: cat.limit,
          spent: cat.spent,
          remaining: cat.remaining,
          percentageUsed: cat.percentage_used,
          status: cat.status, // 'SAFE' | 'WARNING' | 'OVERBUDGET'
          // Zone & AI Advice masih null di tahap ini
        })
    );
  },

  /**
   * Mengambil data zone & advice dari API /budget/advisor dan menggabungkannya ke Entity
   * @param {BudgetSummaryEntity} summaryEntity - Entity yang sudah ada
   * @param {object} apiAdviceData - Data dari API Advisor { zone, advice }
   * @returns {BudgetSummaryEntity} - Entity baru yang sudah lengkap
   */
  mapAiAdviceToEntity(summaryEntity, apiAdviceData) {
    if (!apiAdviceData) return summaryEntity;

    // Kita buat instance baru agar immutable (praktik baik di state management)
    return new BudgetSummaryEntity({
      ...summaryEntity, // Copy properti lama
      zone: apiAdviceData.zone, // Tambahkan data baru
      aiAdvice: apiAdviceData.advice,
    });
  },

  /**
   * Mengubah data transaksi dari API menjadi TransactionEntity
   * @param {object} apiTransaction
   * @returns {TransactionEntity}
   */
  mapTransactionFromApi(apiTransaction) {
    if (!apiTransaction) return null;
    return new TransactionEntity({
      id: apiTransaction.id,
      amount: apiTransaction.amount,
      note: apiTransaction.note,
      date: apiTransaction.date,
      // Asumsi API transaksi include data kategori
      categoryName: apiTransaction.category?.name,
      categoryIcon: apiTransaction.category?.icon,
    });
  },

  /**
   * Mengubah array kategori mentah dari API /budget/categories menjadi array CategoryEntity
   * @param {Array} apiCategoriesList
   * @returns {CategoryEntity[]}
   */
  mapCategoryListFromApi(apiCategoriesList) {
    if (!apiCategoriesList || !Array.isArray(apiCategoriesList)) return [];

    return apiCategoriesList.map(
      (cat) =>
        new CategoryEntity({
          id: cat.id,
          name: cat.name,
          type: cat.type,
          icon: cat.icon,
          isDefault: cat.isDefault,
        })
    );
  },
};
