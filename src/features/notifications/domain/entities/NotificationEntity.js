export class NotificationEntity {
  constructor({ id, title, message, type, isRead, createdAt }) {
    this.id = id;
    this.title = title || "";
    this.message = message || "";
    this.type = type || "INFO"; // 'ALERT' | 'AI_INSIGHT' | 'INFO'
    this.isRead = !!isRead;
    this.createdAt = createdAt || null;
  }
}
