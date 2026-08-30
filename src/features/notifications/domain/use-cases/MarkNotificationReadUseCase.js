export class MarkNotificationReadUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id) { return await this.repository.markAsRead(id); }
}
