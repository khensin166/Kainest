export class GetSystemUpdatesUseCase {
  constructor(repository) { this.repository = repository; }
  async execute() { return await this.repository.getSystemUpdates(); }
}
