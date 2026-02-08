// src/features/todos/domain/entities/TodoEntity.js

export class TodoEntity {
  constructor({ id, title, description, isCompleted, sortOrder, coupleId, createdBy, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
    this.sortOrder = sortOrder;
    this.coupleId = coupleId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
