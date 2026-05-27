export class ClassifyTransactionUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute(text) {
    return await this.repository.classifyTransaction(text);
  }
}
