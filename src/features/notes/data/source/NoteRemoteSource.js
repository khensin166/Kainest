import apiClient from "../../../../lib/apiClient";

export class NoteRemoteSource {
  async getNotes() {
    const response = await apiClient.get("/notes");
    return response.data; // Mengharapkan { success: true, data: [...] }
  }

  async getNoteById(noteId) {
    const response = await apiClient.get(`/notes/${noteId}`);
    return response.data; // Mengharapkan { success: true, data: {...} }
  }

  async createNote(data) {
    // data = { title, content, shareWithPartner, partnerPermission }
    const response = await apiClient.post("/notes", data);
    return response.data; // Mengharapkan { success: true, data: {...} }
  }

  async updateNote(noteId, data) {
    // data = { title, content }
    const response = await apiClient.patch(`/notes/${noteId}`, data);
    return response.data; // Mengharapkan { success: true, data: {...} }
  }

  async updateNotePermissions(noteId, data) {
    // data = { is_public, shareWithPartner, partnerPermission }
    const response = await apiClient.patch(`/notes/${noteId}/share`, data);
    return response.data; // Mengharapkan { success: true, data: {...} }
  }

  async deleteNote(noteId) {
    const response = await apiClient.delete(`/notes/${noteId}`);
    return response.data; // Mengharapkan { success: true, message: "..." }
  }

  async getPublicNote(noteId) {
    const response = await apiClient.get(`/notes/public/${noteId}`);
    return response.data; // Mengharapkan { success: true, data: {...} }
  }
}