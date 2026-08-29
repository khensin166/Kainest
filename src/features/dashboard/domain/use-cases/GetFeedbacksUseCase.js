export class GetFeedbacksUseCase {
  constructor(repository) { this.repository = repository; }
  async execute() { return await this.repository.getFeedbacks(); }
}
