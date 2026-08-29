import { IDashboardRepository } from "../../domain/repository/IDashboardRepository";
import { DashboardRemoteSource } from "../source/DashboardRemoteSource";
import { DashboardMapper } from "../mappers/DashboardMapper";
import { left, right, ServerFailure } from "@/core/error/failure";

export class DashboardRepository extends IDashboardRepository {
  constructor() {
    super();
    this.remoteSource = new DashboardRemoteSource();
  }

  async getSystemUpdates() {
    try {
      const data = await this.remoteSource.getSystemUpdates();
      return right(DashboardMapper.mapSystemUpdateList(data?.updates));
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || error.message));
    }
  }

  async syncSystemUpdates() {
    try {
      const data = await this.remoteSource.syncSystemUpdates();
      return right({ newlyAdded: data?.newlyAdded ?? 0, blasted: data?.blasted ?? 0 });
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || error.message));
    }
  }

  async getFeedbacks() {
    try {
      const data = await this.remoteSource.getFeedbacks();
      return right(DashboardMapper.mapFeedbackList(data?.feedbacks));
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || error.message));
    }
  }

  async submitFeedback(payload) {
    try {
      await this.remoteSource.submitFeedback(payload);
      return right(true);
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || error.message));
    }
  }

  async hideFeedback(id) {
    try {
      await this.remoteSource.hideFeedback(id);
      return right(true);
    } catch (error) {
      return left(new ServerFailure(error.response?.data?.message || error.message));
    }
  }
}
