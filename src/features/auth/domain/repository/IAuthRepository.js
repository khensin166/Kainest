// 📦features/auth/domain/repository/IAuthRepository.js
export class IAuthRepository {
  /**
   * @returns {Promise<{token: string, user: UserEntity}>}
   */
  async login(email, password) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  /**
   * @returns {Promise<UserEntity>}
   */
  async getProfile(token) {
    throw new Error("METHOD_NOT_IMPLEMENTED");
  }

  async logout() {
    throw new Error("METHOD_NOT_IMPLEMENTED");
}
}