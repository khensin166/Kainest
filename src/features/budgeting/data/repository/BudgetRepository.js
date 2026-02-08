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

  /**
   * BARU: Mengambil daftar transaksi (pagination)
   * Returns: { data: Entity[], meta: Object }
   */
  async getTransactions(params) {
    try {
      const response = await this.remoteSource.getTransactions(params);
      if (response.success) {
        const entities = BudgetMapper.mapTransactionListFromApi(response.data);
        
        // MAPPING METADATA: Pastikan formatnya sesuai dengan yang ekspektasi Store (CamelCase)
        // Backend mungkin mengirim snake_case (current_page, last_page, dll)
        const rawMeta = response.meta || {};
        
        const mappedMeta = {
          totalItems: rawMeta.totalItems || rawMeta.total || 0,
          totalPages: rawMeta.totalPages || rawMeta.last_page || 1,
          currentPage: rawMeta.currentPage || rawMeta.current_page || 1,
          itemsPerPage: rawMeta.itemsPerPage || rawMeta.per_page || 10,
        };

        return right({
          transactions: entities,
          meta: mappedMeta, 
        });
      } else {
        return left(
          new ServerFailure(
            response.message || "Gagal mengambil daftar transaksi."
          )
        );
      }
    } catch (error) {
      return left(
        new ServerFailure(error.response?.data?.message || error.message)
      );
    }
  }

  /**
   * BARU: Mengambil detail satu transaksi untuk diedit
   */
  async getTransactionById(id) {
    try {
      const response = await this.remoteSource.getTransactionById(id);
      if (response.success && response.data) {
        const entity = BudgetMapper.mapTransactionFromApi(response.data);
        return right(entity);
      } else {
        return left(
          new ServerFailure(response.message || "Transaksi tidak ditemukan.")
        );
      }
    } catch (error) {
      return left(
        new ServerFailure(error.response?.data?.message || error.message)
      );
    }
  }

  /**
   * BARU: Update transaksi
   */
  async updateTransaction(id, data) {
    try {
      const response = await this.remoteSource.updateTransaction(id, data);
      if (response.success) {
        // Opsional: kembalikan data yang baru diupdate jika perlu
        return right(true);
      } else {
        return left(
          new ServerFailure(response.message || "Gagal mengupdate transaksi.")
        );
      }
    } catch (error) {
      return left(
        new ServerFailure(error.response?.data?.message || error.message)
      );
    }
  }

  /**
   * BARU: Hapus transaksi
   */
  async deleteTransaction(id) {
    try {
      const response = await this.remoteSource.deleteTransaction(id);
      if (response.success) {
        return right(true); // Sukses
      } else {
        return left(
          new ServerFailure(response.message || "Gagal menghapus transaksi.")
        );
      }
    } catch (error) {
      return left(
        new ServerFailure(error.response?.data?.message || error.message)
      );
    }
  }
  /**
   * BARU: Setup Budget Configuration
   */
  async setupBudget(data) {
    try {
      const response = await this.remoteSource.setupBudget(data);
      if (response.success) {
        return right(true);
      } else {
        return left(
          new ServerFailure(response.message || "Gagal menyimpan konfigurasi budget.")
        );
      }
    } catch (error) {
      return left(
        new ServerFailure(error.response?.data?.message || error.message)
      );
    }
  }
}
