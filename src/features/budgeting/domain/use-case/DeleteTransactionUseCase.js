export class DeleteTransactionUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id) { return await this.repository.deleteTransaction(id); }
}