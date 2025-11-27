export class GetSpendingTrendUseCase {
  constructor(repository) {
    this.repository = repository;
  }

  async execute() {
    // Meneruskan panggilan ke repository yang akan mengembalikan tipe Either
    return await this.repository.getSpendingTrend();
  }
}