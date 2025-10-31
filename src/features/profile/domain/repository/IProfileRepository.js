export class IProfileRepository {
  /**
   * @returns {Promise<Either<Failure, ProfileEntity>>}
   */
  async getProfile() {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @param {object} profileData (misal: { name, displayName, phoneNumber })
   * @returns {Promise<Either<Failure, ProfileEntity>>}
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