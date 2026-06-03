import api from "@/lib/apiClient";

export class AdminRemoteSource {
  async getUsers() {
    const response = await api.get("/admin/users");
    return response.data; // { success: true, data: [...] }
  }

  async updateUserAccess(userId, data) {
    const response = await api.put(`/admin/users/${userId}/access`, data);
    return response.data; // { success: true, data: {...} }
  }
}
