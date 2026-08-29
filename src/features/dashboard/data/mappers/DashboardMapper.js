import { SystemUpdateEntity } from "../../domain/entities/SystemUpdateEntity";
import { FeedbackEntity } from "../../domain/entities/FeedbackEntity";

export const DashboardMapper = {
  mapSystemUpdateList(list) {
    if (!Array.isArray(list)) return [];
    return list.map((u) => new SystemUpdateEntity(u));
  },

  /** Meratakan user.profile.* dan user.* agar template tidak menyentuh bentuk API. */
  mapFeedbackList(list) {
    if (!Array.isArray(list)) return [];
    return list.map(
      (fb) =>
        new FeedbackEntity({
          id: fb.id,
          message: fb.message,
          rating: fb.rating,
          displayName: fb.user?.profile?.displayName || fb.user?.name,
          avatarUrl: fb.user?.profile?.avatarUrl || fb.user?.image,
        })
    );
  },
};
