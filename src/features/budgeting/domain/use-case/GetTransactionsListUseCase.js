export class GetTransactionsListUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(params) { return await this.repository.getTransactions(params); }
}