import { BillEntity, SavingGoalEntity, PlanHealthEntity } from "../../domain/entities/PlanEntities";

export const PlansMapper = {
  toBills(payload) {
    return (payload?.bills ?? []).map((b) => new BillEntity(b));
  },
  toCycle(payload) {
    return payload?.cycle ?? null;
  },
  toGoals(payload) {
    return (payload ?? []).map((g) => new SavingGoalEntity(g));
  },
  toHealth(payload) {
    return new PlanHealthEntity(payload ?? {});
  },
};
