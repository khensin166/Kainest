// 📄 src/features/auth/domain/repository/IAuthRepository.js (PERBAIKI)

export class IAuthRepository {
  /**
   * @param {string} email
   * @param {string} password
   * @param {string} displayName
   * @returns {Promise<{left: Failure, right: null} | {left: null, right: boolean}>} // <-- UBAH INI
   */
  async register(email, password, displayName) {
    throw new Error("IAuthRepository.register() harus diimplementasikan");
  }
  async login(email, password) {
    throw new Error("IAuthRepository.login() harus diimplementasikan");
  }
  async getCurrentUser() {
    throw new Error("IAuthRepository.getCurrentUser() harus diimplementasikan");
  }
  async logout() {
    throw new Error("IAuthRepository.logout() harus diimplementasikan");
  }
}