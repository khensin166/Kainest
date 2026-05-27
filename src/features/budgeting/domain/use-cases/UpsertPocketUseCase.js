export class UpsertPocketUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(data) {
    return await this.repository.upsertPocket(data);
  }
}
