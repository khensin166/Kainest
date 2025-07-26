import apiClient from "../../../../lib/apiClient";

export class AuthRemoteSource {
  async login(email, password) {
    try {
      const response = await apiClient.post("/user/admin/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      // Ini sudah benar
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await apiClient.get("/user/admin/me");
      return response.data;
    } catch (error) {
      // Diperbaiki agar konsisten dengan login
      throw error;
    }
  }

  async logout() {
    try {
      await apiClient.post("/user/admin/logout");
    } catch (error) {
      console.error(
        "Server logout failed, proceeding with client-side logout.",
        error
      );
    }
  }
}
