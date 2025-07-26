import apiClient from "../../../../lib/apiClient";

export class SettingsRemoteSource {
  async changePassword({ currentPassword, newPassword, confirmationPassword }) {
    try {
      const response = await apiClient.put("/user/admin/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        confirmation_password: confirmationPassword,
      });
      return response.data;
    } catch (error) {
      // Lempar error asli agar repository bisa memeriksanya
      throw error;
    }
  }
}
