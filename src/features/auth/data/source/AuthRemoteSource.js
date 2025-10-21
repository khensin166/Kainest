// 📄 src/features/auth/data/source/AuthRemoteSource.js (GANTI TOTAL)

import api from "@/lib/apiClient";

export class AuthRemoteSource {
  /**
   * Memanggil endpoint /auth/login di Hono API
   * @param {string} email
   * @param {string} password
   * @returns {Promise<object>} Respons data (misal: { success: true, token: "..." })
   */
  async login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    return response.data; // Mengembalikan { success: true, token: "..." }
  }

  /**
   * Memanggil endpoint /auth/register di Hono API
   * @param {string} email
   * @param {string} password
   * @param {string} displayName (Asumsi endpoint Anda menerima ini)
   * @returns {Promise<object>} Respons data (misal: { success: true, message: "..." })
   */
  async register(email, password, displayName) {
    // ASUMSI: Endpoint /auth/register Anda menerima displayName.
    // Jika tidak, Anda harus menghapusnya dari sini dan dari use case.
    // Namun, RegisterPage.vue Anda MEMILIKINYA, jadi saya sertakan.
    const response = await api.post("/auth/register", {
      email,
      password,
      displayName, // Pastikan backend Hono Anda menangani ini!
    });
    return response.data;
  }

  /**
   * Memanggil endpoint untuk mendapatkan profil user yang sedang login.
   * INI ADALAH ENDPOINT BARU YANG HARUS ANDA BUAT DI HONO.JS.
   * Misal: GET /auth/me
   * @returns {Promise<object>} Data profil user (misal: { id, email, displayName, ... })
   */
  async getProfile() {
    // PENTING: Anda harus membuat endpoint ini di Hono.js.
    // Endpoint ini harus:
    // 1. Memvalidasi Bearer Token yang dikirim (dikerjakan oleh middleware auth Hono)
    // 2. Mengembalikan data user yang login (dari database)
    //
    // Saya asumsikan endpoint-nya adalah 'GET /auth/me'
    const response = await api.get("/auth/me");
    return response.data; // Asumsi mengembalikan data user
  }
}