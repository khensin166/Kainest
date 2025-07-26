import { ISettingsRepository } from "../../domain/repository/ISettingsRepository";
import {
  left,
  right,
  ServerFailure,
  IncorrectPasswordFailure,
} from "../../../../core/error/failure";
import { SettingsRemoteSource } from "../source/SettingsRemoteSource";

export class SettingsRepository extends ISettingsRepository {
  constructor() {
    super();
    this.remoteSource = new SettingsRemoteSource();
  }

  async changePassword(passwords) {
    try {
      const response = await this.remoteSource.changePassword(passwords);
      // Jika berhasil, kita hanya butuh pesannya
      return right({ message: response.message });
    } catch (error) {
      const statusCode = error.response?.status;
      const errorData = error.response?.data;

      // Tangani kasus spesifik "invalid current password"
      if (statusCode === 400) {
        return left(
          new IncorrectPasswordFailure(
            errorData.message || "Password saat ini salah."
          )
        );
      }

      // Untuk error lainnya (token expired, dll)
      return left(
        new ServerFailure(errorData.message || "Gagal mengubah password.")
      );
    }
  }
}
