export class UpdateTransactionUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id, data) { return await this.repository.updateTransaction(id, data); }
}