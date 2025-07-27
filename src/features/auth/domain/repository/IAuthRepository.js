// src/features/auth/domain/repository/IAuthRepository.js
// Ini adalah 'kontrak' atau interface abstrak untuk repository otentikasi.
// Setiap repository otentikasi yang kita buat HARUS memiliki fungsi-fungsi ini.

export class IAuthRepository {
  /**
   * @param {string} email
   * @param {string} password
   * @param {string} displayName
   * @returns {Promise<UserEntity>}
   */
  async register(email, password, displayName) {
    throw new Error("IAuthRepository.register() harus diimplementasikan");
  }

   /**
   * ✅ TAMBAHKAN INI: Kontrak untuk fungsi login.
   * Mengembalikan UserEntity pada sukses, atau Failure pada gagal.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{left: Failure, right: null} | {left: null, right: UserEntity}>}
   */
  async login(email, password) {
    throw new Error("IAuthRepository.login() harus diimplementasikan");
  }

  // Nanti kita akan tambahkan logout, getProfile, dll. di sini.
}
