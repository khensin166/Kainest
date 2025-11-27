// src/features/budgeting/data/mappers/BudgetMapper.js
import { BudgetSummaryEntity } from "../../domain/entities/BudgetSummaryEntity";
import { TransactionEntity } from "../../domain/entities/TransactionEntity";
import { CategoryEntity } from "../../domain/entities/CategoryEntity";
import { TrendDataEntity } from "../../domain/entities/TrendDataEntity";

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

  /**
   * MAPPING RUMIT: Mengubah data "bolong-bolong" dari API menjadi data harian penuh.
   * API hanya kirim tgl yang ada transaksi. Mapper ini mengisi tgl kosong dengan 0.
   * @param {Array} sparseApiData - Data dari API [{date: '2025-11-05', totalSpent: 100000}]
   * @returns {TrendDataEntity[]} - Array penuh dari tgl 1 s/d akhir bulan
   */
  mapTrendDataFromApi(sparseApiData) {
    const rawData = sparseApiData || [];
    const fullMonthData = [];

    // 1. Tentukan konteks waktu saat ini (untuk tahu jumlah hari dalam bulan ini)
    const now = new Date();
    const year = now.getFullYear();
    const monthIndex = now.getMonth(); // 0-11
    // Trik mendapatkan jumlah hari di bulan ini (tgl 0 bulan depan = tgl terakhir bulan ini)
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // 2. Looping dari hari ke-1 sampai hari terakhir bulan ini
    for (let day = 1; day <= daysInMonth; day++) {
      // Buat string tanggal format YYYY-MM-DD (harus sama persis dengan format API backend)
      // String padStart memastikan ada angka 0 di depan jika tgl < 10 (misal: '05')
      const dateString = `${year}-${String(monthIndex + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;

      // 3. Cari apakah tanggal ini ada di data API?
      const foundData = rawData.find((item) => item.date === dateString);

      // 4. Jika ketemu pakai datanya, jika tidak pakai 0. Buat Entity.
      fullMonthData.push(
        new TrendDataEntity({
          date: dateString,
          amount: foundData ? foundData.totalSpent : 0,
        })
      );
    }

    return fullMonthData;
  },

  /**
   * BARU: Mengubah array transaksi mentah dari API menjadi array TransactionEntity
   * @param {Array} apiTransactionList
   * @returns {TransactionEntity[]}
   */
  mapTransactionListFromApi(apiTransactionList) {
    if (!apiTransactionList || !Array.isArray(apiTransactionList)) return [];
    // Kita gunakan ulang mapper satuan yang sudah ada
    return apiTransactionList.map((item) => this.mapTransactionFromApi(item));
  },
};
