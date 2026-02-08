// src/features/todos/data/source/TodoRemoteSource.js
import apiClient from "../../../../lib/apiClient";

export class TodoRemoteSource {
  async getTodos() {
    const response = await apiClient.get("/todos");
    return response.data; // Mengharapkan { success: true, data: [...] }
  }

  async createTodo(data) {
    // data = { title }
    const response = await apiClient.post("/todos", data);
    return response.data; // Mengharapkan { success: true, data: {...} }
  }

  async updateTodo(todoId, data) {
    // data = { title, is_completed }
    const response = await apiClient.patch(`/todos/${todoId}`, data);
    return response.data; // Mengharapkan { success: true, data: {...} }
  }

  async deleteTodo(todoId) {
    const response = await apiClient.delete(`/todos/${todoId}`);
    return response.data; // Mengharapkan { success: true, message: "..." }
  }
}
