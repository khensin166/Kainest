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

  // --- RBAC / IAM ---
  async getGroups() {
    const response = await api.get("/rbac/groups");
    return response.data;
  }

  async createGroup(data) {
    const response = await api.post("/rbac/groups", data);
    return response.data;
  }

  async updateGroup(groupId, data) {
    const response = await api.put(`/rbac/groups/${groupId}`, data);
    return response.data;
  }

  async deleteGroup(groupId) {
    const response = await api.delete(`/rbac/groups/${groupId}`);
    return response.data;
  }

  async assignUserToGroup(userId, groupId) {
    const response = await api.put(`/rbac/users/${userId}/assign-group`, { groupId });
    return response.data;
  }
}
