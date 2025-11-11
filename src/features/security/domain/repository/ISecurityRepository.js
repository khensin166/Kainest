// src/features/security/domain/repository/ISecurityRepository.js
export class ISecurityRepository {
  /**
   * @param {object} passwords
   * @returns {Promise<Either<Failure, {message: string}>>}
   */
  async changePassword(passwords) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }
}