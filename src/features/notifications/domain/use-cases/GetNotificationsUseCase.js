export class GetNotificationsUseCase {
  constructor(repository) { this.repository = repository; }
  async execute() { return await this.repository.getNotifications(); }
}
