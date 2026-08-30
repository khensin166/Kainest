import { NotificationEntity } from "../../domain/entities/NotificationEntity";

export const NotificationMapper = {
  mapList(list) {
    if (!Array.isArray(list)) return [];
    return list.map((n) => new NotificationEntity(n));
  },
};
