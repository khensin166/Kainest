import { left, GeneralFailure } from "../../../../core/error/failure";

export class CreateTransactionUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(data) {
    // Validasi data input sebelum dikirim ke repository
    if (!data.amount || data.amount <= 0) {
      return left(new GeneralFailure("Jumlah transaksi harus lebih dari 0."));
    }
    if (!data.categoryId) {
      return left(new GeneralFailure("Kategori harus dipilih."));
    }
    if (!data.date) {
      return left(new GeneralFailure("Tanggal transaksi harus diisi."));
    }

    try {
      return await this.repository.createTransaction(data);
    } catch (error) {
      return left(new GeneralFailure("Gagal menyimpan transaksi baru."));
    }
  }
}