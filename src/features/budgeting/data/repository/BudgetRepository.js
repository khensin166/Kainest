// src/features/budgeting/data/repository/BudgetRepository.js
import { BudgetRemoteSource } from "../source/BudgetRemoteSource";
import { BudgetMapper } from "../mappers/BudgetMapper";
import { left, right, ServerFailure } from "../../../../core/error/failure";

export class BudgetRepository {
  constructor() {
    // Dependency Injection manual (bisa diganti pakai library kalau mau lebih canggih)
    this.remoteSource = new BudgetRemoteSource();
  }

  /**
   * Mengambil summary bulanan dan mengubahnya jadi Entity
   * @returns {Promise<Either<Failure, BudgetSummaryEntity[]>>}
   */
  async getMonthlySummary() {
    try {
      const response = await this.remoteSource.getMonthlySummary();

      // Log untuk memastikan data mentah dari API masuk
      // console.log("[REPO] Raw response:", response);

      if (response.success) {
        const rawCategories = response.data?.categories || [];
        const entities = BudgetMapper.mapSummaryListFromApi(rawCategories);

        // Log untuk memastikan mapper bekerja
        // console.log("[REPO] Mapped entities:", entities);

        // 🔑 KUNCI PERBAIKAN: Bungkus data dengan right()
        // Kita kembalikan objek data lengkap (totals + categories) agar Store bisa pakai keduanya
        return right({
          month: response.data.month,
          totals: response.data.totals,
          categories: entities,
        });
      } else {
        // 🔑 KUNCI PERBAIKAN: Bungkus error dengan left()
        return left(
          new ServerFailure(response.message || "Gagal mengambil data budget.")
        );
      }
    } catch (error) {
      // Tangkap error jaringan/axios
      return left(
        new ServerFailure(
          error.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan koneksi."
        )
      );
    }
  }

  async getAiAdvice(categoryId) {
    try {
      const response = await this.remoteSource.getAiAdvice(categoryId);

      if (response.success && response.data) {
        // 🔑 KUNCI PERBAIKAN: Bungkus dengan right()
        return right(response.data);
      } else {
        return left(
          new ServerFailure(response.message || "Gagal analisis AI.")
        );
      }
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message || "AI tidak merespons."
        )
      );
    }
  }

  async createTransaction(transactionData) {
    try {
      const response = await this.remoteSource.createTransaction(
        transactionData
      );

      if (response.success && response.data) {
        const entity = BudgetMapper.mapTransactionFromApi(response.data);
        // 🔑 KUNCI PERBAIKAN: Bungkus dengan right()
        return right(entity);
      } else {
        return left(
          new ServerFailure(response.message || "Gagal mencatat transaksi.")
        );
      }
    } catch (error) {
      return left(
        new ServerFailure(error.response?.data?.message || "Kesalahan server.")
      );
    }
  }

  /**
   * Mengambil daftar kategori untuk dropdown dan mengubahnya jadi Entity
   * @returns {Promise<Either<Failure, CategoryEntity[]>>}
   */
  async getCategories() {
    try {
      const response = await this.remoteSource.getCategories();

      if (response.success) {
        // Data kategori ada di response.data (array)
        const rawList = response.data || [];
        // Mapping ke Entity
        const entities = BudgetMapper.mapCategoryListFromApi(rawList);
        // Bungkus dengan right() (Sukses)
        return right(entities);
      } else {
        // Bungkus error dengan left() (Gagal)
        return left(
          new ServerFailure(
            response.message || "Gagal mengambil daftar kategori."
          )
        );
      }
    } catch (error) {
      // Tangkap error jaringan/axios
      return left(
        new ServerFailure(
          error.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan koneksi."
        )
      );
    }
  }

  async getSpendingTrend() {
    try {
      const response = await this.remoteSource.getSpendingTrend();

      if (response.success && response.data) {
        const sparseTrendData = response.data.trend || [];

        // 🔥 Panggil Mapper Ajaib kita untuk mengisi data kosong
        const fullEntities = BudgetMapper.mapTrendDataFromApi(sparseTrendData);

        // Bungkus dengan right()
        return right(fullEntities);
      } else {
        return left(
          new ServerFailure(
            response.message || "Gagal mengambil data tren grafik."
          )
        );
      }
    } catch (error) {
      return left(
        new ServerFailure(
          error.response?.data?.message ||
            error.message ||
            "Terjadi kesalahan koneksi."
        )
      );
    }
  }
}
