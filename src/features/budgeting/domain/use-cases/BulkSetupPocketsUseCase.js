export class BulkSetupPocketsUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(data) {
    return await this.repository.bulkSetupPockets(data);
  }
}
