import { IPlansRepository } from "../../domain/repository/IPlansRepository";
import { PlansMapper } from "../mappers/PlansMapper";
import {
  left,
  right,
  ServerFailure,
  taggedServerFailure,
} from "../../../../core/error/failure";

/**
 * Exception BERHENTI di lapisan ini. Store dan komponen hanya melihat Either,
 * tidak pernah try/catch.
 */
export class PlansRepository extends IPlansRepository {
  constructor(remoteSource) {
    super();
    this.remoteSource = remoteSource;
  }

  /**
   * Membungkus satu panggilan HTTP menjadi Either.
   * `ubah` memetakan payload API menjadi Entity sebelum sampai ke store.
   */
  async #jalankan(panggilan, ubah = (d) => d, pesanGagal = "Terjadi kesalahan.") {
    try {
      const response = await panggilan();
      if (response?.success === false) {
        return left(new ServerFailure(response.message || pesanGagal, response.code));
      }
      return right(ubah(response?.data ?? response));
    } catch (error) {
      return left(
        taggedServerFailure(
          error,
          error.response?.data?.message || pesanGagal,
          error.response?.data?.code
        )
      );
    }
  }

  getBills() {
    return this.#jalankan(
      () => this.remoteSource.getBills(),
      (data) => ({ bills: PlansMapper.toBills(data), cycle: PlansMapper.toCycle(data) }),
      "Gagal memuat tagihan."
    );
  }

  getUpcomingBills(days = 7) {
    return this.#jalankan(
      () => this.remoteSource.getUpcomingBills(days),
      (data) => PlansMapper.toBills(data),
      "Gagal memuat tagihan mendatang."
    );
  }

  createBill(payload) {
    return this.#jalankan(() => this.remoteSource.createBill(payload), undefined, "Gagal menyimpan tagihan.");
  }
  updateBill(id, payload) {
    return this.#jalankan(() => this.remoteSource.updateBill(id, payload), undefined, "Gagal memperbarui tagihan.");
  }
  deleteBill(id) {
    return this.#jalankan(() => this.remoteSource.deleteBill(id), undefined, "Gagal menghapus tagihan.");
  }
  payBill(id, payload) {
    return this.#jalankan(() => this.remoteSource.payBill(id, payload), undefined, "Gagal menandai lunas.");
  }
  skipBill(id) {
    return this.#jalankan(() => this.remoteSource.skipBill(id), undefined, "Gagal melewati tagihan.");
  }
  cancelBillPayment(id) {
    return this.#jalankan(() => this.remoteSource.cancelBillPayment(id), undefined, "Gagal membatalkan penandaan.");
  }

  getGoals() {
    return this.#jalankan(
      () => this.remoteSource.getGoals(),
      (data) => PlansMapper.toGoals(data),
      "Gagal memuat wishlist."
    );
  }
  createGoal(payload) {
    return this.#jalankan(() => this.remoteSource.createGoal(payload), undefined, "Gagal menyimpan wishlist.");
  }
  updateGoal(id, payload) {
    return this.#jalankan(() => this.remoteSource.updateGoal(id, payload), undefined, "Gagal memperbarui wishlist.");
  }
  deleteGoal(id) {
    return this.#jalankan(() => this.remoteSource.deleteGoal(id), undefined, "Gagal menghapus wishlist.");
  }
  updateGoalStatus(id, status) {
    return this.#jalankan(() => this.remoteSource.updateGoalStatus(id, status), undefined, "Gagal mengubah status.");
  }
  contribute(id, payload) {
    return this.#jalankan(() => this.remoteSource.contribute(id, payload), undefined, "Gagal mencatat setoran.");
  }
  getContributions(id) {
    return this.#jalankan(() => this.remoteSource.getContributions(id), undefined, "Gagal memuat riwayat setoran.");
  }

  getHealth() {
    return this.#jalankan(
      () => this.remoteSource.getHealth(),
      (data) => PlansMapper.toHealth(data),
      "Gagal memuat status keuangan."
    );
  }

  getTemplates() {
    return this.#jalankan(() => this.remoteSource.getTemplates(), undefined, "Gagal memuat template.");
  }
  createTemplate(payload) {
    return this.#jalankan(() => this.remoteSource.createTemplate(payload), undefined, "Gagal menyimpan template.");
  }
  deleteTemplate(id) {
    return this.#jalankan(() => this.remoteSource.deleteTemplate(id), undefined, "Gagal menghapus template.");
  }
}
