import { INotificationRepository } from "../../domain/repository/INotificationRepository";
import { NotificationRemoteSource } from "../source/NotificationRemoteSource";
import { NotificationMapper } from "../mappers/NotificationMapper";
import { left, right, ServerFailure } from "@/core/error/failure";

export class NotificationRepository extends INotificationRepository {
  constructor() {
    super();
    this.remoteSource = new NotificationRemoteSource();
  }

  async getNotifications() {
    try {
      const data = await this.remoteSource.getNotifications();
      return right({
        notifications: NotificationMapper.mapList(data?.notifications),
        unreadCount: data?.unreadCount ?? 0,
      });
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || error.message));
    }
  }

  async markAsRead(id) {
    try {
      await this.remoteSource.markAsRead(id);
      return right(true);
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || error.message));
    }
  }
}
