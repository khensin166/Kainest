import { ICoupleRepository } from "../../domain/repository/ICoupleRepository";
import { CoupleRemoteSource } from "../source/CoupleRemoteSource";
import { mapCoupleFromApi } from "../mappers/CoupleMapper";
import {
  left,
  right,
  ServerFailure,
} from "../../../../core/error/failure";

export class CoupleRepository extends ICoupleRepository {
  constructor() {
    super();
    this.remoteSource = new CoupleRemoteSource();
  }

  async getCoupleStatus() {
    try {
      const response = await this.remoteSource.getCoupleStatus();
      if (response.success) {
        // Gunakan mapper untuk mengubah respons API menjadi Entity
        const entity = mapCoupleFromApi(response);
        return right(entity);
      } else {
        // Ini seharusnya tidak terjadi di GET, tapi sebagai penjaga
        return left(new ServerFailure(response.message || "Gagal mengambil status pasangan."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async connectWithCode(invitationCode) {
    try {
      const response = await this.remoteSource.connectWithCode(invitationCode);
      if (response.success) {
        // Jika konek berhasil, backend akan mengembalikan data Couple
        // Kita panggil ulang getCoupleStatus untuk mendapatkan data yang terformat
        return this.getCoupleStatus();
      } else {
        return left(new ServerFailure(response.message || "Gagal terhubung."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Gagal terhubung."));
    }
  }
}