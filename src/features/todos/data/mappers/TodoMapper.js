// src/features/todos/data/mappers/TodoMapper.js
import { TodoEntity } from "../../domain/entities/TodoEntity";

/**
 * Memetakan respons API (dari POST /todos atau PATCH /todos/:id)
 * @param {object} apiTodo - Objek Todo mentah dari API
 * @returns {TodoEntity}
 */
export function mapTodoFromApi(apiTodo) {
  if (!apiTodo) return null;

  return new TodoEntity({
    id: apiTodo.id,
    title: apiTodo.title,
    description: apiTodo.description,
    isCompleted: apiTodo.is_completed, // Mapping snake_case ke camelCase
    sortOrder: apiTodo.sort_order,
    coupleId: apiTodo.couple_id,
    createdBy: apiTodo.created_by,
    createdAt: apiTodo.created_at,
    updatedAt: apiTodo.updated_at,
  });
}

/**
 * Memetakan respons API list (dari GET /todos)
 * @param {Array<object>} apiTodoList - Array todo mentah dari API
 * @returns {Array<TodoEntity>}
 */
export function mapTodoListFromApi(apiTodoList) {
  if (!apiTodoList || !Array.isArray(apiTodoList)) return [];
  
  return apiTodoList.map(apiTodo => mapTodoFromApi(apiTodo));
}
