// src/features/security/data/source/SecurityRemoteSource.js
import apiClient from "../../../../lib/apiClient";

export class SecurityRemoteSource {
  async changePassword({ currentPassword, newPassword, confirmationPassword }) {
    try {
      // ASUMSI: Endpoint Anda ada di /auth/password
      // Kode lama Anda menunjuk ke '/user/admin/change-password'
      // Ganti di bawah ini jika endpoint Anda berbeda
      const response = await apiClient.put("/auth/password", { // <-- PERIKSA ENDPOINT INI
        currentPassword: currentPassword,
        newPassword: newPassword,
        confirmationPassword: confirmationPassword,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}