// src/features/settings/domain/repository/ISettingsRepository.js
import { UserEntity } from "../../../auth/domain/entities/UserEntity";

export class ISettingsRepository {
  /**
   * @param {object} passwords 
   * @returns {Promise<Either<Failure, {message: string}>>}
   */
  async changePassword(passwords) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  // Tambahkan kontrak lain di sini jika ada,
  // misalnya untuk update profil
  // async updateProfile(userData) {
  //   throw new Error("METHOD_NOT_IMPLEMENTED");
  // }
}