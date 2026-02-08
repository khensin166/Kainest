// src/features/todos/data/repository/TodoRepository.js
import { ITodoRepository } from "../../domain/repository/ITodoRepository";
import { TodoRemoteSource } from "../source/TodoRemoteSource";
import { mapTodoFromApi, mapTodoListFromApi } from "../mappers/TodoMapper";
import {
  left,
  right,
  ServerFailure,
} from "../../../../core/error/failure";

export class TodoRepository extends ITodoRepository {
  constructor() {
    super();
    this.remoteSource = new TodoRemoteSource();
  }

  async getTodos() {
    try {
      const response = await this.remoteSource.getTodos();
      if (response.success) {
        const entities = mapTodoListFromApi(response.data);
        return right(entities);
      } else {
        return left(new ServerFailure(response.message || "Gagal mengambil todos."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async createTodo(data) {
    try {
      const response = await this.remoteSource.createTodo(data);
      if (response.success) {
        const entity = mapTodoFromApi(response.data);
        return right(entity);
      } else {
        return left(new ServerFailure(response.message || "Gagal membuat todo."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async updateTodo(todoId, data) {
    try {
      const response = await this.remoteSource.updateTodo(todoId, data);
      if (response.success) {
        const entity = mapTodoFromApi(response.data);
        return right(entity);
      } else {
        return left(new ServerFailure(response.message || "Gagal update todo."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }

  async deleteTodo(todoId) {
    try {
      const response = await this.remoteSource.deleteTodo(todoId);
      if (response.success) {
        return right(true); // Sukses
      } else {
        return left(new ServerFailure(response.message || "Gagal menghapus todo."));
      }
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || "Error server."));
    }
  }
}
