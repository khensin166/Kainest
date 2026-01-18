export class GetTransactionDetailUseCase {
  constructor(repository) { this.repository = repository; }
  async execute(id) { return await this.repository.getTransactionById(id); }
}