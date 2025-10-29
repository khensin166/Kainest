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

  // --- TAMBAHAN BARU ---
  /**
   * @param {object} profileData (misal: { name, displayName, phone_number })
   * @returns {Promise<Either<Failure, UserEntity>>}
   */
  async updateProfile(profileData) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {File} file
   * @returns {Promise<Either<Failure, {url: string}>>}
   */
  async uploadAvatar(file) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}