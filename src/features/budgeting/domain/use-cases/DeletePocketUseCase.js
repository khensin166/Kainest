export class DeletePocketUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(categoryId) {
    return await this.repository.deletePocket(categoryId);
  }
}
